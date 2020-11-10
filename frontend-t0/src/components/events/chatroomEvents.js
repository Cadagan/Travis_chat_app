import PgpKey, {get_public_key_data, pgpKey, userKeys} from "../services/PGPKey";
import {BACKEND_HOST} from "../../App";
let privateRoom = false;

export function setPrivateRoom(value) {
    privateRoom = value;
}


export function userJoinEvent(username, onDone){
    //We create a pgp key.
    PgpKey.generate(username, key => {
        //pgpKey = key;
        onDone(key);
    });
}
export function userJoinChatroomEvent(room, user, socket, onDone){
    if(privateRoom) {
        const public_key = get_public_key_data(user, room);
        fetch(`${BACKEND_HOST}/encryption/public_key`,
            {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(public_key), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                //We do nothing here lmaooo we're getting the keys another way.
            });
    }
}

export function userLeaveChatroom(user){
    //Probably remove the public key?
}

export function onMessageRecieved(message, socket, onDone){
    let sender = userKeys[message.sender];
    if (message.publicKey) {
        console.log("Receiving message with public key!");
        if (sender) return;
        console.log("Recieved public key! Saving...");
        //We save that users public key and we send ours to them.
        PgpKey.load(message.publicKey, key => {
            let isMyKey = pgpKey.id() === key.id();
            userKeys[key.id()] = isMyKey ? pgpKey : key;
            if (!isMyKey) {
                //We send ours back. TODO do this.
                const publicKey = pgpKey.public();
                const sendBack = {publicKey: publicKey, sender: pgpKey.id()}

                onDone(publicKey);
            }
        });
    } else {
        if(privateRoom) {
            if (pgpKey.canDecrypt()) {
                //We just decrypt with our private key.
                if (message.receiver === pgpKey.id()) {
                    pgpKey.decrypt(message.message, text => {
                        message.message = text;
                        onDone(message);
                    });
                }
            } else {
                console.log("Can't decrypt!")
            }
        } else {
            onDone(message);
        }
    }
}

export function onMessageSend(message, onDone){
    if(privateRoom) {
        Object.keys(userKeys).forEach(keyData => {
            userKeys[keyData].encrypt(message.message, cipher => {
                message.message = cipher;
                message.sender = pgpKey.id();
                message.receiver = keyData;
                message.encrypted = true;
                onDone(message,);
                //Now we can send message to everyone!
                //We should send it to the one with the keyData though don't we? TODO do this.
            });
        });
    } else {
        onDone(message,);
    }
}
