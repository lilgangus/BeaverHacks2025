import { NextResponse } from 'next/server';

import { createContact, getAllContacts, updateContact } from "../mongoAPI/contactsAPI";


export async function GET(request) {
    // return the list of contacts
    // get the username from the query params
    const { searchParams } = new URL(request.url);
    const originUsername = searchParams.get('user');
    if (!originUsername) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const contacts = await getAllContacts(originUsername);

    // format the contacts to turn the _id into a id
    const formattedContacts = contacts.map(contact => ({
        id: contact._id.toString(),
        username: contact.username,
        walletAddress: contact.walletAddress,
    }));

    return NextResponse.json(formattedContacts);
}

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const originUsername = searchParams.get('user');
    if (!originUsername) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }
    

    const { username, walletAddress} = await request.json();
    
    if (!username || !walletAddress || !originUsername) {
        return NextResponse.json({ error: 'Username and wallet address are required' }, { status: 400 });
    }

    // add the contact to the database

    const newContact = await createContact(username, walletAddress, originUsername);
    
    // format the contact to turn the _id into a id
    const formattedContact = {
        id: newContact.insertedId.toString(),
        username,
        walletAddress,
    };
    console.log("New contact:", formattedContact);
    
    return NextResponse.json(formattedContact);
}


export async function PUT(request) {
    
    
    // Getting the data from the request body
    const { username, walletAddress, id } = await request.json();

    if (!username || !walletAddress || !id) {
        return NextResponse.json({ error: 'Username, wallet address and id are required' }, { status: 400 });
    }

    // update the contact in the database
    const updatedContact = await updateContact(id, username, walletAddress);

    // format the contact to turn the _id into a id
    const formattedContact = {
        id: id,
        username,
        walletAddress,
    };


    return NextResponse.json(formattedContact);
}
