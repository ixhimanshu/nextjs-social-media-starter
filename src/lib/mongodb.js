// lib/mongodb.js
import { MongoClient } from "mongodb";

let client;
let clientPromise;

function getClient() {
  const uri = process.env.MONGODB_URI;
  const options = {};

  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    return client.connect();
  }
}

export default getClient;
