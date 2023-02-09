import express from "express";
import * as url from 'url';
import * as path from "path";
import { IP, PORT } from "./config.js";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
app.use(express.static("../client/build"));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client/build/index.html"));
});
app.listen(PORT, IP, () => {
    console.log("server is running");
});