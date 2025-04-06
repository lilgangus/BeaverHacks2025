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
      const db = client.db("Contracts");
      return db.collection("contact");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw new Error("Failed to connect to the database");
    }
}

// const transcript = formData.get("transcript");
// const audio = formData.get("audio"); // this is a Blob/File
// const contact = formData.get("contactPubKey");
// const username = formData.get("username");
// const publicKey = formData.get("publicKey");
async function createContract(transcript, audio, contact, username, publicKey, date) {
    const db = await connectToDatabase();
    const newContract = { transcript, audio, contact, username, publicKey, date };
    const result = await db.insertOne(newContract);
    return result;

}
async function getAllContracts() {
    const db = await connectToDatabase();
    const allContracts = await db.find({}).toArray();
    allContracts.forEach(contract => {
        contract.id = contract._id.toString(); // Convert ObjectId to string
    });
    return allContracts;
}

async function getContractByUsername(username) {
    const db = await connectToDatabase();
    const contract = await db.find({ username }).toArray();
    contract.forEach(contract => {
        contract.id = contract._id.toString(); // Convert ObjectId to string
    });
    return contract;
}

export { createContract, getAllContracts, getContractByUsername };