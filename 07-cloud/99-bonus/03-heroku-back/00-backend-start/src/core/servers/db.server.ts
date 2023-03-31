import { MongoClient, Db, Logger } from 'mongodb';
import { envConstants } from 'core/constants';

if (!envConstants.isProduction) {
  Logger.setLevel('debug');
}

let client: MongoClient;
let dbInstance: Db;

export const connectToDBServer = async (connectionURI: string) => {
  client = new MongoClient(connectionURI);

  await client.connect();

  dbInstance = client.db();
};

export const getDBInstance = (): Db => dbInstance;

export const disconnectFromDbServer = async () => {
  await client.close();
};
