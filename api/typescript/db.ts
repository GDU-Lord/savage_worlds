import { MongoClient } from "mongodb";
import { DB_NAME, DB_URL } from "./config.js";

const client = new MongoClient(DB_URL);
const db = client.db(DB_NAME);

export default db;