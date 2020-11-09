import PgpKey, {pgpKey, userKeys} from "../services/PGPKey";

export function userJoinEvent(username, onDone){
    //We create a pgp key.
    PgpKey.generate(username, key => {
        pgpKey = key;
        //onDone(userRoomId, key);
    })
}
export function userJoinChatroomEvent(room, user, onDone){
    //We send our public key to everyone else, and recieve every other participants public key.
    //TODO do this.
}

export function userLeaveChatroom(user){
    //Probably remove the public key?
}

export function onMessageRecieved(message, onDone){
    if(message.publicKey) {
        //We save that users public key and we send ours to them.
        PgpKey.load(message.publicKey, key=>{
            userKeys.push({username: message.username, key: key});
        });
        //We send ours to everyone. TODO DO THIS
    } else {
        if (pgpKey.canDecrypt()) {
            //We just decrypt with our private key.
            pgpKey.decrypt(message.text, text => {
                message.text = text;
                onDone(message);
            });
        } else {
            console.log("Can't decrypt!")
        }
    }
}

export function onMessageSend(message, onDone){
    userKeys.forEach(keyData =>{
        keyData.key.encrypt(message.message, cipher=> {
            message.message = cipher;
            //Now we can send message to everyone!
            //We should send it to the one with the keyData though don't we? TODO do this.
            onDone(message, keyData);
        });

    });
}
