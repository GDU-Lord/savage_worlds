import express from "express";
import { CLIENT_ADDRESS, IP, PORT } from "./config.js";
import setupRoutes from "./routes.js";
import cors from "cors";
import { createServer } from "http";
import { createSocket, sockets } from "./sockets.js";

export const app = express();
export const http = createServer(app);

function CORS () {
    return cors({
        origin: CLIENT_ADDRESS,
        optionsSuccessStatus: 200,
        credentials: true
    });
}

app.use(CORS());
app.post("*", CORS());
app.put("*", CORS());

setupRoutes(app);
createSocket(http, sockets);

http.listen(PORT, IP, () => {
    console.log("server is running");
});