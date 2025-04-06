const { ObjectId } = require('mongodb');  

const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const connectionString = process.env.MONGODB_STRING;
if (!connectionString) {
  throw new Error("users api: MONGODB_STRING is not defined in the environment variables.");
}

const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
      // Connect if not already connected (no need for `isConnected` check)
      await client.connect();
      const db = client.db("UserSettings");
      return db.collection("users");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw new Error("Failed to connect to the database");
    }
}

async function createUpdateSettings(publicKey, secretKey, originUsername) {
    const db = await connectToDatabase();
    const newContact = { publicKey, secretKey, originUsername };
    // insert the new contact into the database, replacing any existing contact with the same originUsername
    const result = await db.updateOne(
        { originUsername }, // Filter for existing contact
        { $set: newContact }, // Update or insert the new contact
        { upsert: true } // Create a new document if no match is found
    );
    return result;
}

async function hasKeysUploaded(originUsername) {
    const db = await connectToDatabase();

    const result = await db.findOne({ originUsername });
    if (result) {
        if (result.publicKey && result.secretKey) {
            return true;
        }
    }

    return false;
}


async function getUserKeys(originUsername) {
    const db = await connectToDatabase();

    const result = await db.findOne({ originUsername });
    if (result) {
        return {
            publicKey: result.publicKey,
            secretKey: result.secretKey
        };
    }
    return null;
}

async function getUserPublicKey(originUsername) {
    const db = await connectToDatabase();

    const result = await db.findOne({ originUsername });

    if (result) {
        return result.publicKey;
    }
    return null;
}


export { createUpdateSettings, hasKeysUploaded, getUserKeys, getUserPublicKey };