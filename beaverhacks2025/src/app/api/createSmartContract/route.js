import { NextResponse } from "next/server";
import { hasKeysUploaded, getUserKeys } from "../mongoAPI/settingsAPI";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { TransactionBlock } from '@mysten/sui/transactions';

import nacl from 'tweetnacl';

// Helper to convert hex string to Uint8Array.
function hexToUint8Array(hex) {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const uint8 = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    uint8[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return uint8;
}


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

    const audioUrl = storeAudioClipToURL(audio);
    
    
    // const client = new SuiClient({ url: getFullnodeUrl('testnet') });

    // const coins = await client.getCoins({
    //     owner: publicKey,
    //     coinType: '0x2::sui::SUI'
    // });

    // console.log("Coinsfd:", coins);
    
    // const balances = await client.getAllBalances({ owner: publicKey });
    // console.log("Balances:", balances);
    // const objs = await client.getOwnedObjects({ owner: publicKey });
    // console.log("Owned Objects:", objs);

    // Initialize the Sui client (using testnet for example)
    tx.moveCall({
        target: 'your_package::your_module::store_data',
        arguments: [
          tx.pure(String(transcript)),  // Transcript
          tx.pure(String(audioUrl)),      // Audio URL
          tx.pure(String(contact)),       // Contact public key
        ],
    });
    
      // Sign the transaction block using Ed25519 (with tweetnacl).
      const { signature, bytes } = await tx.sign({
        signer: {
          // Return the keypair as needed by the Sui SDK.
          getKeyPair: () => ({ publicKey, secretKey }),
          // The sign function converts the secret key from hex and signs the message.
          sign: async (msg) => {
            const secretKeyUint8 = hexToUint8Array(secretKey);
            // 'msg' should be a Uint8Array; if not, encode it.
            const messageUint8 = typeof msg === "string" ? new TextEncoder().encode(msg) : msg;
            const signatureUint8 = nacl.sign.detached(messageUint8, secretKeyUint8);
            // Return the signature as a hex string.
            return Buffer.from(signatureUint8).toString('hex');
          },
        },
    });
    
      // Execute the transaction on Sui.
    const result = await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
    });
    

    console.log("Transaction result:", result);
    

    return NextResponse.json({ message: "Smart contract created successfully" });
}


function storeAudioClipToURL (audioClip) {
    const url = URL.createObjectURL(audioClip);
    return url;
}