import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "drishti_ai";

export async function getDatabase() {
  if (!uri) {
    return null;
  }

  if (!globalThis.__drishtiMongoPromise) {
    const client = new MongoClient(uri);
    globalThis.__drishtiMongoPromise = client.connect();
  }

  const connectedClient = await globalThis.__drishtiMongoPromise;
  return connectedClient.db(dbName);
}
