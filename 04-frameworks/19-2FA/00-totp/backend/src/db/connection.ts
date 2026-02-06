import { MongoClient, Db } from "mongodb";

let db: Db;

export const connectDB = async (): Promise<Db> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/authdb";

    const client = new MongoClient(mongoURI);
    await client.connect();

    db = client.db("authdb");

    console.log("✅ MongoDB conectado correctamente");

    return db;
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};
