import { NextResponse } from "next/server";
import { hasKeysUploaded, getUserKeys } from "../mongoAPI/settingsAPI";

import { createContract, getAllContracts, getContractByUsername } from "../mongoAPI/contractAPI";


export async function POST(request) {
    const formData = await request.formData();

    const transcript = formData.get("transcript");
    const audio = formData.get("audio"); // this is a Blob/File
    const contact = formData.get("contactPubKey");
    const username = formData.get("username");
    const publicKey = formData.get("publicKey");


    // validate that the username and public key go together

    // check if the user exists
    const hasKeys = await hasKeysUploaded(username);
    if (!hasKeys) {
        return NextResponse.json({ error: "No keys found" }, { status: 404 });
    }

    // get the keys and check if the public key matches
    const keys = await getUserKeys(username);
    if (!keys) {
        return NextResponse.json({ error: "No keys found" }, { status: 404 });
    }
    if (keys.publicKey != publicKey) {
        return NextResponse.json({ error: "Public key does not match" }, { status: 401 });
    }

    const secretKey = keys.secretKey;
 
    

    // create the contract
    const newContract = await createContract(transcript, audio, contact, username, publicKey, new Date());
    if (!newContract) {
        return NextResponse.json({ error: "Failed to create smart contract" }, { status: 500 });
    }


    console.log("New contract:", newContract);
     

    return NextResponse.json({ message: "Smart contract created successfully" , contractID: newContract.insertedId.toString() }, { status: 200 });
}

export async function GET(request) {
    // get the username from the query params
    const { searchParams } = new URL(request.url);
    const originUsername = searchParams.get("user");

    if (!originUsername) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const contracts = await getContractByUsername(originUsername);
    if (!contracts) {
        return NextResponse.json({ error: "No contracts found" }, { status: 404 });
    }
    // format the contracts to turn the _id into a id
    const formattedContracts = contracts.map((contract) => ({
        id: contract._id.toString(),
        transcript: contract.transcript,
        audio: contract.audio,
        contact: contract.contact,
        username: contract.username,
        publicKey: contract.publicKey,
        date: contract.date,
    }));
    return NextResponse.json(formattedContracts);

}
