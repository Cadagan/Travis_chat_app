let sessionData = {sessionID: null, username:null};
console.log("Initializing sessions");

function setSessionID(newId){
    console.log("Setting session id to: "+newId);
    sessionData.sessionID = newId;
}
function getSessionData(){
    return sessionData;
}

function getSessionID(){
    return sessionData.sessionID;
}

function setUsername(newUsername){
    sessionData.username = newUsername;
}

function getUsername(){
    return sessionData.username;
}

module.exports = {setSessionID, getSessionID, setUsername, getUsername};
