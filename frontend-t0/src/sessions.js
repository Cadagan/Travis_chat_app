//import Cookies from 'universal-cookie';
let sessionData = {sessionID: null, username: null};
console.log('Initializing sessions');

function setSessionID(newId) {
  console.log('Setting session id to: ' + newId);
  sessionData.sessionID = newId.sessionID;
  sessionData.token = newId.token;
}
function getSessionData() {
  return {
    sessionID: getSessionID(),
    username: getUsername(),
    token: getToken(),
    role: getRole(),
  };
}

function getSessionID() {
}

function setUsername(newUsername) {
}

function getUsername() {
}

function getToken() {
}

function setRole(role) {
}
function getRole() {
}

module.exports = {
  setSessionID,
  getSessionID,
  setUsername,
  getUsername,
  getSessionData,
  getToken,
  setRole,
  getRole,
};
