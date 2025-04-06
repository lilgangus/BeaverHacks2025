import { NextResponse } from "next/server";
import { hasKeysUploaded, getUserKeys } from "../mongoAPI/settingsAPI";
import {
  SuiClient,
  TransactionBlock,
  fromB64,
  Ed25519Keypair,
} from "@mysten/sui-client";
import { getFullnodeUrl } from "@mysten/sui-client";


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

    // const client = new SuiClient({ url: getFullnodeUrl('testnet') });

    // const coins = await client.getCoins({
    //     owner: publicKey,
    //     coinType: '0x2::sui::SUI'
    // });

    // console.log("Coinsfd:", coins);
    
    // const balances = await client.getAllBalances({ owner: publicKey });
    // console.log("Balances:", balances);


    const payload = {
        transcript,
        contact,
        timestamp: Date.now(),
      };
    const jsonBlob = JSON.stringify(payload);
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    
    const tx = new TransactionBlock();
    const record = tx.moveCall({
        target: "0xPACKAGE::TranscriptData::create_record",
        arguments: [
          tx.pure(jsonBlob),
          tx.pure(publicKey),
        ],
    });

    const kp = Ed25519Keypair.fromSecretKey(fromB64(secretKey));
    const result = await client.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        signer: kp,
        options: { showEffects: true, showObjectChanges: true },
    });

    console.log("Transaction Result:", result.effects);

    const objs = await client.getOwnedObjects({ owner: publicKey });
    console.log("Owned Objects:", objs);

    return NextResponse.json({ message: "Smart contract created successfully" });
}