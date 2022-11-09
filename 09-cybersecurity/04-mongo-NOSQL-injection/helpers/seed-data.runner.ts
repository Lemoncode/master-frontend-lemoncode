import { MongoClient, Db } from "mongodb";

let dbInstance: Db;
const MONGODB_URI = "mongodb://localhost:27017/test-database";

export const run = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  dbInstance = client.db();

  const userList = [
    {
      name: "Juan Pérez",
      age: 30,
      email: "juan@email.com",
    },
    {
      name: "Pedro Ramírez",
      age: 25,
      email: "pedro@email.com",
    },
  ];

  await dbInstance.collection("users").insertMany(userList);
  console.log("Users inserted");

  await client.close();
};
