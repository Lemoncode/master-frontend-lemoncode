import { MongoClient, Db } from "mongodb";

let dbInstance: Db;
const MONGODB_URI = "mongodb://localhost:27017/test-database";

export const run = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  dbInstance = client.db();

  const search = "Juan Pérez";

  const user = await dbInstance.collection("users").findOne({
    $where: function () {
      return this.name == search;
    },
  });

  console.log(user);

  await client.close();
};
