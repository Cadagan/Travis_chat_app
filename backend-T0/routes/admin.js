require('dotenv').config();
var express = require('express');
var router = express.Router();
const {client} = require('../database');
const {emitMessageSent} = require('../websocket');
let AWS = require('aws-sdk');
const fetch = require('node-fetch');
const execSync = require('child_process').execSync;
const LOCAL = true;

// const {LOCAL} = require("../bin/www");

var myIp;
if (!LOCAL) {
  myIp = execSync(
    'curl http://169.254.169.254/latest/meta-data/public-hostname',
    {encoding: 'utf-8'},
  );
} else {
  myIp = '';
}

/* GET home page. */
router.get('/admin/users/latest/:count', function(req, res, next) {
  let count = req.params.count;
  const query = {
    // give the query a unique name
    name: 'fetch-latest-users',
    text:
      'SELECT id, username,message, roomid,datetime FROM messages WHERE roomid=$1 ORDER BY datetime DESC LIMIT $2',
    values: [roomid, count],
  };
  sendMessages(query, res);
});

function sendMessages(query, res) {
  const messages = [];
  client.query(query, (err, queryRes) => {
    if (err) {
      console.log(err.stack);
    } else {
      queryRes.rows.forEach(message => {
        const message_datetime = message.datetime;
        const hours =
          message_datetime.getHours() < 10
            ? '0' + message_datetime.getHours()
            : message_datetime.getHours();
        const minutes =
          message_datetime.getMinutes() < 10
            ? '0' + message_datetime.getMinutes()
            : message_datetime.getMinutes();
        const message_time = `${hours}:${minutes}`;
        messages.push({
          username: message.username,
          message: message.message,
          date: getParsedDate(message.datetime),
          time: message_time,
          id: message.id,
        });
      });
    }
    res.append('CurrentInstance', myIp);
    res.status(200).send(messages.reverse());
  });
}

router.post('/admin/users/before/:count', function(req, res, next) {
  let count = req.params.count;
  let roomid = req.params.roomid;
  let id = req.body.id;
  const query = {
    // give the query a unique name
    name: 'fetch-before-messages',
    text:
      'SELECT id, username,message, roomid,datetime FROM messages WHERE roomid=$1 AND id<$2 ORDER BY datetime DESC LIMIT $3',
    values: [roomid, id, count],
  };

  sendMessages(query, res);
});

function getParsedDate(date) {
  const parsedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dateNow = new Date();
  dateNow.setHours(0);
  dateNow.setMinutes(0);
  dateNow.setSeconds(0, 0);
  const dateYesterday = new Date(dateNow);
  dateYesterday.setDate(dateYesterday.getDate() - 1);
  if (parsedDate.getTime() === dateNow.getTime()) return 'Today';
  else if (parsedDate.getTime() === dateYesterday.getTime()) return 'Yesterday';
  else
    return `${parsedDate.getFullYear()}-${parsedDate.getMonth() +
      1}-${parsedDate.getDate()}`;
}

async function sendNotification(roomName, message, username) {
  const query = {
    // give the query a unique name
    name: 'get-user-email',
    text: 'SELECT email FROM users WHERE username=$1',
    values: [username],
  };
  client.query(query, (err, queryRes) => {
    if (err) {
      console.log('Error while getting user from the databaes');
    } else {
      if (queryRes.rows.length > 0) {
        const email = queryRes.rows[0].email;
        console.log('Se le está enviando un correo a: ' + email);
      } else {
        console.log('No se encontró un usuario con username: ' + username);
      }
    }
  });
}

module.exports = router;
