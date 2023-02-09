import { ObjectId } from "mongodb"
import { character } from "./character.js";
import db from "./db.js";
import createToken from "./token.js";

export interface campaign {
    _id?: ObjectId;
    token: string;

    characters?: {
        name: string;
        token: string;
        campaign_id: ObjectId;
    }[];
}

export default class Campaign implements campaign {

    static async get (token: string): Promise<campaign | null | undefined> {

        const campaigns = db.collection("campaigns");

        try {
            var campaign = await campaigns.findOne({ token }) as campaign | null;
        }
        catch (err) {
            console.log(err);
            return;
        }
        
        if(campaign == null) return null;

        const characters = db.collection("characters");
        
        try {
            var list = await characters.find<character>({ campaign_id: campaign._id }).toArray();
        }
        catch (err) {
            console.log(err);
            return;
        }

        campaign.characters = list.map(char => ({
            name: char.textStatistics.name,
            token: char.token,
            campaign_id: char.campaign_id
        }));

        return campaign;

    }

    static async create () {
        const campaign = new Campaign;

        const campaigns = db.collection("campaigns");

        try {
            await campaigns.insertOne(campaign);
            return campaign;
        }
        catch (err) {
            console.log(err);
            return null;
        }
        
    }

    static async reset (token: ObjectId) {

        const campaigns = db.collection("campaigns");
        const newToken = createToken();

        try {
            const { matchedCount } = await campaigns.updateOne({ token }, { $set: { token: newToken } });
            if(matchedCount === 0)
                return null;
            return newToken;
        }
        catch (err) {
            console.log(err);
            return "";
        }
        
    }

    _id: ObjectId;
    token: string;
    characters: campaign["characters"];

    constructor () {
        this._id = new ObjectId();
        this.token = createToken();
        this.characters = [];
    }
}