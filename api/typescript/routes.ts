import express from "express";
import Campaign from "./campaign.js";
import Character, { character } from "./character.js";

export default function setupRoutes (app: express.Application) {

    app.put("/campaign/create", async (req, res) => {

        const campaign = await Campaign.create();

        if(campaign == null)
            return res.sendStatus(500);

        res.send(campaign);
    
    });

    app.put("/campaign/reset", express.json(), async (req, res) => {

        const token = req.body.token ?? "" as string;

        const newToken = await Campaign.reset(token);
        
        if(newToken === "")
            return res.sendStatus(500);

        res.send(newToken);

    });
    
    app.get("/campaign/get", express.urlencoded(), async (req, res) => {
    
        const token = req.query.master_token as string ?? "";
    
        const campaign = await Campaign.get(token);

        if(campaign === undefined)
            return res.sendStatus(500);
        if(campaign === null)
            return res.sendStatus(404)
    
        res.send(campaign);
    
    });

    app.put("/character/create", express.json(), async (req, res) => {

        const token = req.body.master_token as string ?? "";

        const campaign = await Campaign.get(token);

        if(campaign === undefined)
            return res.sendStatus(500);
        if(campaign === null)
            return res.sendStatus(400);

        const character = await Character.create(campaign._id);

        if(character == null)
            return res.sendStatus(500);
            
        res.send(character);

    });

    app.put("/character/update", express.json(), async (req, res) => {

        const character = req.body as character;

        const r = await Character.update(character);

        if(r === undefined)
            return res.sendStatus(500);
        if(r === null)
            return res.sendStatus(400);
        
        res.sendStatus(200);

    });

    app.put("/character/delete", express.json(), async (req, res) => {

        const { token, master_token} = req.body as {
            token: string;
            master_token: string;
        };

        const r = await Character.delete(token, master_token);

        if(r === undefined)
            return res.sendStatus(500);
        if(r === false)
            return res.sendStatus(400);
        
        res.sendStatus(200);

    });

    app.get("/character/get", express.urlencoded(), async (req, res) => {

        const token = req.query.token as string ?? "";

        const character = await Character.get(token);

        if(character == null)
            return res.sendStatus(404);

        res.send(character);

    });
    
}