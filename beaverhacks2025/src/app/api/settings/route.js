import { NextResponse } from 'next/server';
import { createUpdateSettings, hasKeysUploaded, getUserKeys, getUserPublicKey } from "../mongoAPI/settingsAPI";

export async function POST(req) {
    const {username, publicKey, secretKey} = await req.json();

    if (!username || !publicKey || !secretKey) {
        return NextResponse.json({ error: 'Username, public key and secret key are required' }, { status: 400 });
    }

    // upload new keys
    // publicKey, secretKey, originUsername

    const newKeys = await createUpdateSettings(publicKey, secretKey, username);
    
    return NextResponse.json(newKeys);

}

export async function GET(req) {
    // get query params
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('user');
    const type = searchParams.get('type');
    console.log("Username:", username);
    console.log("Type:", type);

    if (!username | !type) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (type == "pubKey")  {
        const publicKey = await getUserPublicKey(username);
        if (!publicKey) {
            return NextResponse.json({ error: 'No keys found' }, { status: 404 });
        }
        return NextResponse.json(publicKey);
    } else if (type == "keys") {
        const keys = await getUserKeys(username);
        if (!keys) {
            return NextResponse.json({ error: 'No keys found' }, { status: 404 });
        }
        return NextResponse.json(keys);
    } else if (type == "checkKeys") {
        const hasKeys = await hasKeysUploaded(username);
        if (!hasKeys) {
            return NextResponse.json({ error: 'No keys found' }, { status: 404 });
        }
        return NextResponse.json(hasKeys);
    }

    // const publicKey = await getUserKeys(username);
    // if (!publicKey) {
    //     return NextResponse.json({ error: 'No keys found' }, { status: 404 });
    // }
    // return NextResponse.json(publicKey);

}