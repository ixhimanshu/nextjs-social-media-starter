import { MongoClient } from 'mongodb';


// lib/mongodb.js
export default async function connectToDB() {
  const uri = process.env.MONGODB_URI;
  const options = {};

  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return global._mongoClientPromise;
  } else {
    return new MongoClient(uri, options).connect();
  }
}
