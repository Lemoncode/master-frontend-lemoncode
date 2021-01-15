import { connect } from 'mongoose';

export const connectToDB = async (connectionString: string) => {
  const db = await connect(connectionString, {
    poolSize: 5,
    useNewUrlParser: true,
    promiseLibrary: Promise,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  console.log('Connected to DB');

  return db;
};
