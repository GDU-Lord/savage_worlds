import { ObjectId } from "mongodb";
import db from "./db.js";
import createToken from "./token.js";

export type level = [number, number];

export interface attributes {
    agility: level;
    strength: level;
    smarts: level;
    spirit: level;
    vigor: level;
};

export interface skills {
    common_knowledge: level;
    notice: level;
    persuasion: level;
    stealth: level;
    athletics: level;
    boating: level;
    driving: level;
    fighting: level;
    // lockpicking: level;
    thievery: level;
    piloting: level;
    riding: level;
    shooting: level;
    // swimming: level;
    // throwing: level;
    gambling: level;
    healing: level;
    // investigation: level;
    research: level;
    repair: level;
    // streetwise: level;
    survival: level;
    taunt: level;
    // tracking: level;
    guts: level;
    intimidation: level;
    // climbing: level;
    battle: level;
    hacking: level;
    electronics: level;
    weird_science: level;
    psionics: level;
    spellcasting: level;
    performance: level;
    faith: level;
    focus: level;
    [key: string]: level;
};

export interface textStatistics {
    playerName: string;
    name: string;
    race: string;
};

export interface otherStatistics {
    speed: number;
    attributePoints: number;
    skillPoints: number;
    bonusPoints: number;
    extraSpend: number;
    size: number;
    weightAmplifier: number;
    money: number;
    wounds: number;
    fatigue: number;
    bennies: number;
};

export interface edge {
    id: string;
    name: string;
    notes: string;
};

export interface hindrance {
    id: string;
    name: string;
    notes: string;
};

export interface tool {
    id: string;
    name: string;
    amount: number;
    weight: number;
    notes: string;
};

export interface armor {
    armor: number;
    price: number;
    weight: number;
    minStrength: number;
    head: boolean;
    torso: boolean;
    arms: boolean;
    legs: boolean;
    worn: boolean;
    name: string;
    id: string;
};

export interface shield {
    bonus: number;
    cover: number;
    price: number;
    weight: number;
    minStrength: number;
    worn: boolean;
    name: string;
    id: string;
};

export interface weapon {
    id: string;
    name: string;
    price: number;
    weight: number;
    type: string;
    range: string;
    rof: number;
    ap: number;
    minStrength: number;
    damage: string;
    notes: string;
    worn: boolean;
};

export interface character {
    _id?: ObjectId;
    token?: string;
    campaign_id: ObjectId;
    attributes: attributes;
    skills: skills;
    otherStatistics: otherStatistics;
    textStatistics: textStatistics;
    edges: edge[];
    hindrances: hindrance[];
    tools: tool[];
    armor: armor[];
    weapons: weapon[];
}

const defaultSkills = {
    common_knowledge: [4, 0],
    notice: [4, 0],
    persuasion: [4, 0],
    stealth: [4, 0],
    athletics: [4, 0],
    boating: [0, 0],
    driving: [0, 0],
    fighting: [0, 0],
    thievery: [0, 0],
    piloting: [0, 0],
    riding: [0, 0],
    shooting: [0, 0],
    gambling: [0, 0],
    healing: [0, 0],
    research: [0, 0],
    repair: [0, 0],
    survival: [0, 0],
    taunt: [0, 0],
    guts: [0, 0],
    intimidation: [0, 0],
    psionics: [0, 0],
    focus: [0, 0],
    faith: [0, 0],
    electronics: [0, 0],
    battle: [0, 0],
    weird_science: [0, 0],
    spellcasting: [0, 0],
    performance: [0, 0],
    hacking: [0, 0],
};

function copy (obj: { [key: string]: any } | string | number) {
    if(obj instanceof Array) {
        const res = [];
        for(const elem of obj) {
            res.push(copy(elem));
        }
        return res as any;
    }
    if(typeof obj === "object") {
        const res ={};
        for(const i in obj) {
            res[i] = obj[i];
        }
        return res as any;
    }
    return obj as any;
}

export default class Character implements character {

    static async get (token: string) {

        const characters = db.collection("characters");

        try {
            return await characters.findOne({ token }) as character;
        }
        catch (err) {
            console.log(err);
            return null;
        }

    }

    static async create (master_id: ObjectId) {

        const character = new Character(master_id);
        
        const characters = db.collection("characters");

        try {
            await characters.insertOne(character);
            return character;
        }
        catch (err) {
            console.log(err);
            return null;
        }

    }

    static async update (character: character) {

        const characters = db.collection("characters");

        try {
            character = this.fix(character);
            const { matchedCount } = await characters.updateOne({ token: character.token }, { $set: character });
            if(matchedCount === 0)
                return null;
            return character;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }

    }

    static async delete (token: string, master_token: string) {

        const campaigns = db.collection("campaigns");

        try {
            var campaign = await campaigns.findOne({ token: master_token });
        }
        catch (err) {
            console.log(err);
            return undefined;
        }

        const characters = db.collection("characters");

        try {
            const { deletedCount } = await characters.deleteOne({ token: token, campaign_id: campaign._id });
            if(deletedCount === 0)
                return false;
            return true;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }

    }

    static fix (character: character) {
        const skills = character.skills;
        for(const i in defaultSkills) {
            if(skills[i] == null)
                skills[i] = copy(defaultSkills);
        }
        return character;
    }

    _id: ObjectId;
    token: string;
    campaign_id: ObjectId;
    attributes: attributes;
    skills: skills;
    otherStatistics: otherStatistics;
    textStatistics: textStatistics;
    edges: edge[];
    hindrances: hindrance[];
    tools: tool[];
    armor: armor[];
    shields: shield[];
    weapons: weapon[];

    constructor (campaign_id: ObjectId) {

        this._id = new ObjectId;
        this.token = createToken();
        this.campaign_id = campaign_id;
        this.attributes = {
            agility: [4, 0],
            strength: [4, 0],
            smarts: [4, 0],
            spirit: [4, 0],
            vigor: [4, 0],
        };
        this.skills = copy(defaultSkills);
        this.otherStatistics = {
            speed: 6,
            attributePoints: 5,
            skillPoints: 12,
            bonusPoints: 0,
            extraSpend: 0,
            size: 0,
            weightAmplifier: 5,
            money: 500,
            wounds: 0,
            fatigue: 0,
            bennies: 3,
        };
        this.textStatistics = {
            playerName: "",
            name: "",
            race: "",
        };
        this.edges = [];
        this.hindrances = [];
        this.tools = [];
        this.armor = [];
        this.shields = [];
        this.weapons = [];

    }

}