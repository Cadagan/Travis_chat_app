import PgpKey, {pgpKey, userKeys} from "../services/PGPKey";
import {BACKEND_HOST} from "../../App";

export function userJoinEvent(username, onDone){
    //We create a pgp key.
    PgpKey.generate(username, key => {
        console.log();
        //pgpKey = key;
        onDone(key);
    });
}
export function userJoinChatroomEvent(room, user, socket, onDone){
    //We send our public key to everyone else, and recieve every other participants public key. TODO backend side.
    const public_key = {publicKey: pgpKey.public(), username: user, roomId: room};
    fetch(`${BACKEND_HOST}/encryption/public_key`,
        {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(public_key), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            data.keyData.forEach(message=>{
                PgpKey.load(message.publicKey, key=>{
                    userKeys.push({id: key.id(), username: message.username, key: key});
                });
            });
        });

    io.on('auth-message-response', res=>{
        console.log(res);
    });
}

export function userLeaveChatroom(user){
    //Probably remove the public key?
}

export function onMessageRecieved(message, onDone){
    if(message.publicKey) {
        console.log("Recieved public key! Saving...");
        //We save that users public key and we send ours to them.
        PgpKey.load(message.publicKey, key=>{
            userKeys.push({id: key.id(), username: message.username, key: key});
        });
        //We send ours to whoever sent us their public key. TODO DO THIS
        const publicKey = pgpKey.public();
        onDone(publicKey);
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
