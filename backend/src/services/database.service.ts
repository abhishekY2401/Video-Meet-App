// External Dependencies

import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables

export const collections: {
  users?: mongoDB.Collection;
  userSocket?: mongoDB.Collection;
} = {};

// Initialize Connection

export async function connectToDatabase() {
  dotenv.config();

  console.log(process.env.MONGO_URL);

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.MONGO_URL ?? ""
  );

  // console.log(client);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  console.log("db", db);

  const userCollection: mongoDB.Collection = db.collection(
    process.env.USER_COLLECTION_NAME ?? ""
  );

  collections.users = userCollection;

  const userSocketCollection: mongoDB.Collection = db.collection(
    process.env.USER_SOCKET_COLLECTION ?? ""
  );

  collections.userSocket = userSocketCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection`
  );
}
