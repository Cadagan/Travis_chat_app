require('dotenv').config();
var express = require('express');
var router = express.Router();
const {client} = require('../database');
let AWS = require('aws-sdk');
const execSync = require('child_process').execSync;
<<<<<<< HEAD
const LOCAL = false;
const {emitAuthMessageToRoom, io} = require('../websocket');

// const {LOCAL} = require("../bin/www");

var myIp;
if (!LOCAL) {
=======
const {emitAuthMessageToRoom, io} = require('../websocket');

const {LOCAL} = require("../bin/www");
console.log("Local is: ", LOCAL);

var myIp;
if (!LOCAL) {
  console.log("Local inside here is: ", LOCAL);
>>>>>>> 6fe614b5fee172a28a9a79c5127e9030f579fffb
  myIp = execSync(
    'curl http://169.254.169.254/latest/meta-data/public-hostname',
    {encoding: 'utf-8'},
  );
} else {
  myIp = '';
}

/* GET home page. */
router.post('/public_key', function(req, res, next) {
  let object = {};
  let publicKey = req.body.publicKey;
  let username = req.body.username;
  let roomId = req.body.roomId;
  let sender = req.body.sender;

  console.log(`Public Key arrived from ${username}: ${publicKey}`);
  const message = {publicKey: publicKey, username: username, sender: sender};
  emitAuthMessageToRoom(message, roomId);
  res.append('CurrentInstance', myIp);
  res.status(200).send(object);
});

module.exports = router;
