import 'dotenv/config';

import { Db, MongoClient } from 'mongodb';

let mongoClient: MongoClient | null = null;
let mongoClientPromise: Promise<MongoClient> | null = null;

function getMongoUri(): string | undefined {
  return process.env['MONGODB_URI'];
}

export function isMongoConfigured(): boolean {
  return Boolean(getMongoUri() && process.env['MONGODB_DB_NAME']);
}

export async function connectToMongo(): Promise<MongoClient> {
  if (mongoClient) {
    return mongoClient;
  }

  if (!mongoClientPromise) {
    const uri = getMongoUri();

    if (!uri) {
      throw new Error('Missing MONGODB_URI environment variable.');
    }

    mongoClientPromise = new MongoClient(uri).connect();
  }

  mongoClient = await mongoClientPromise;
  return mongoClient;
}

export async function getDatabase(): Promise<Db> {
  const dbName = process.env['MONGODB_DB_NAME'];

  if (!dbName) {
    throw new Error('Missing MONGODB_DB_NAME environment variable.');
  }

  const client = await connectToMongo();
  return client.db(dbName);
}

export async function pingMongo(): Promise<boolean> {
  if (!isMongoConfigured()) {
    return false;
  }

  const db = await getDatabase();
  await db.command({ ping: 1 });
  return true;
}
