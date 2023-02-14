import {Server as HTTPServer} from "http";
import { Socket, Server } from "socket.io";
import Campaign from "./campaign.js";
import Character, { character } from "./character.js";
import { CLIENT_ADDRESS } from "./config.js"

enum userMode {
    CHARACTER = "character",
    MASTER = "master",
    MENU = "menu"
};

class User {

    static list: { [id: string]: User } = {};

    static remove (userId: string) {
        delete this.list[userId];
    }

    static find (condition: (user: User) => boolean) {
        const res = [];
        for(const i in this.list) {
            const user = this.list[i];
            if(condition(user))
                res.push(user);
        }
        return res;
    }

    id: string;
    socket: Socket;
    data: {
        mode: userMode.CHARACTER | userMode.MASTER | userMode.MENU;
        token: string;
    };

    constructor (socket: Socket) {
        this.id = socket.id;
        this.data = {
            mode: userMode.MENU,
            token: ""
        };
        this.socket = socket;
        User.list[this.id] = this;
    }

}

interface SocketData {
    data: any;
    status: 200 | 500 | 400 | 404;
}

export function createSocket (server: HTTPServer, listener: (user: User) => void = () => {}) {

    const io = new Server(server, {
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
        cors: {
            origin: CLIENT_ADDRESS
        }
    }); 

    io.on("connection", socket => {
        const user = new User(socket);
        socket.on("disconnect", () => User.remove(user.id));
        listener(user);
    });

}

export function sockets (user: User) {

    const socket = user.socket;

    socket.on("character-get", async (token: string) => {

        user.data.mode = userMode.CHARACTER;
        user.data.token = token;

        const data = await Character.get(token);
        const status = data != null ? 200 : 404;

        socket.emit("character-get", { data, status });

    });

    socket.on("character-create", async (token: string) => {

        const campaign = await Campaign.get(token);
        const tag = "character-create";

        const res = (status: SocketData["status"], data: SocketData["data"]) => socket.emit(tag, { data, status });

        if(campaign === undefined)
            return res(500, null);
        if(campaign === null)
            return res(400, null);

        const character = await Character.create(campaign._id);

        if(character == null)
            return res(500, null);
            
        res(200, character);
    });

    socket.on("character-save", async (character: character) => {

        const data = await Character.update(character);
        let status = 200;
        const tag = "character-save";

        const res = (status: SocketData["status"], data: SocketData["data"]) => socket.emit(tag, { data, status });

        if(data === undefined)
            return res(500, null);
        if(data === null)
            return res(400, null);
        
        socket.emit("character-save", { status, data: null });

        if(status !== 200)
            return;

        const otherViewers = User.find(u => u.id !== user.id && u.data.mode === userMode.CHARACTER && u.data.token == character.token);

        otherViewers.forEach(u => u.socket.emit("character-get", {
            status: 200,
            data
        }));

    });

}