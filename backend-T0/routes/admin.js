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
router.get('/users/latest/:count', function(req, res, next) {
  console.log('Getting latest users');
  let count = req.params.count;
  const query = {
    // give the query a unique name
    name: 'fetch-latest-users',
    text:
      'SELECT id, username, name, email, role, googleid FROM users ORDER BY id DESC LIMIT $1',
    values: [count],
  };
  console.log(query);
  sendUsers(query, res);
});

function sendUsers(query, res) {
  const users = [];
  client.query(query, (err, queryRes) => {
    if (err) {
      console.log(err.stack);
    } else {
      queryRes.rows.forEach(user => {
        users.push({
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          googleid: user.googleid,
        });
      });
    }
    res.append('CurrentInstance', myIp);
    res.status(200).send(users.reverse());
  });
}

router.post('/users/before/:count', function(req, res, next) {
  let count = req.params.count;
  let id = req.body.id;
  const query = {
    // give the query a unique name
    name: 'fetch-before-users',
    text:
      'SELECT id, username, name FROM users WHERE id<$1 ORDER BY id DESC LIMIT $2',
    values: [id, count],
  };

  sendUsers(query, res);
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

async function sendNotification(roomName, user, username) {
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
