import { MongoClient, Db } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://admin:admin@localhost:27017";
const DB_NAME = process.env.DB_NAME || "passkey-app";

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`Conectado a MongoDB (db: ${DB_NAME})`);
  return db;
}

export function getDB(): Db {
  if (!db) throw new Error("Base de datos no inicializada. Llama a connectDB() primero.");
  return db;
}
