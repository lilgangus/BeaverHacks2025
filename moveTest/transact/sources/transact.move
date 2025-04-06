module transact::testTransact {
    use sui::object;
    use sui::transfer;
    use sui::tx_context;

    /// A resource to store transcript, audio URL, and contact public key.
    public struct Data has key, store {
        id: object::UID,
        transcript: vector<u8>,
        audio_url: vector<u8>,
        contact: vector<u8>,
    }

    /// Stores the transcript, audio URL, and contact public key on-chain.
    public entry fun store_data(
        transcript: vector<u8>, 
        audio_url: vector<u8>, 
        contact: vector<u8>, 
        ctx: &mut tx_context::TxContext
    ) {
        let id = object::new(ctx);

        let data = Data { id, transcript, audio_url, contact };

        transfer::transfer(data, tx_context::sender(ctx));
    }
}
