require('dotenv').config();
var express = require('express');
var router = express.Router();
const {client} = require('../database');
//const {emitMessageSent} = require('../websocket');
let AWS = require('aws-sdk');
const fetch = require('node-fetch');
const execSync = require('child_process').execSync;
const LOCAL = true;

// const {LOCAL} = require("../bin/www");

if (!LOCAL) {
  var myIp = execSync(
    'curl http://169.254.169.254/latest/meta-data/public-hostname',
    {encoding: 'utf-8'},
  );
}

/* GET home page. */

router.post('/public_key', function(req, res, next) {
  let object = {};
  let count = req.params.count;
  let roomid = req.params.roomid;
  let id = req.body.id;
  res.append('CurrentInstance', myIp);
  res.status(200).send(object);
});

module.exports = router;
