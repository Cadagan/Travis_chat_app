//import Cookies from 'universal-cookie';
//const cookies = new Cookies();
//const cookies = require('universal-cookie');
let sessionData = {sessionID: null, username: null, roomPassword: null};
console.log('Initializing sessions');

function setSessionID(newId) {
  //console.log(cookies);
  console.log('Setting session id to: ' + newId);
  sessionData.sessionID = newId.sessionID;
  sessionData.token = newId.token;
  //cookies.set('sessionID', newId.sessionID);
  //cookies.set('token', newId.token);
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
  //return cookies.get('sessionID');
}

function setUsername(newUsername) {
  //cookies.set('username', newUsername);
}

function getUsername() {
  //return cookies.get('username');
}

function getToken() {
  //return cookies.get('token');
}

function setRole(role) {
  //cookies.set('role', role);
}
function getRole() {
  //return cookies.get('role');
}

module.exports = {
  setSessionID,
  getSessionID,
  setUsername,
  getUsername,
  getToken,
  setRole,
  getRole,
};
