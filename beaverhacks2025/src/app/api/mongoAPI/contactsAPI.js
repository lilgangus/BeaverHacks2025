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
      const db = client.db("UserContacts");
      return db.collection("contacts");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw new Error("Failed to connect to the database");
    }
}

async function createContact(username, walletAddress, originUsername) {
    const contacts = await connectToDatabase();
    const newContact = { username, walletAddress, originUsername };
    const result = await contacts.insertOne(newContact);
    return result;
}

async function getAllContacts(originUsername) {
  const contacts = await connectToDatabase();
//   const allContacts = await contacts.find({}).toArray();
    const allContacts = await contacts.find({ originUsername }).toArray();
    allContacts.forEach(contact => {
        contact.id = contact._id.toString(); // Convert ObjectId to string
    }
    );

    return allContacts;
}

async function updateContact(id, username, walletAddress) {
    const objectId = new ObjectId(id);
    // Handle undefined values by setting them to empty string    
    const contacts = await connectToDatabase();
    const result = await contacts.updateOne(
        
        { _id: objectId }, // Convert string id to ObjectId
        // { _id: id },
        { $set: { username, walletAddress } }

    );

    console.log("Updated contactresulit:", result);
    return result;
}

export { createContact, getAllContacts, updateContact };