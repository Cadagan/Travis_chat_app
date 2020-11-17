

require('dotenv').config();
var express = require('express');
var router = express.Router();
const {client} = require('../database');
const {emitMessageSent, emitEncryptedMessage} = require('../websocket');
let AWS = require('aws-sdk');
const fetch = require('node-fetch');
const execSync = require('child_process').execSync;
<<<<<<< HEAD
const LOCAL = false;

// const {LOCAL} = require("../bin/www");

var myIp;

if (!LOCAL) {
=======
const {LOCAL} = require("../bin/www");

var myIp;

if (!LOCAL) {
    console.log("Local inside here is: ", LOCAL);
>>>>>>> 6fe614b5fee172a28a9a79c5127e9030f579fffb
  myIp = execSync(
    'curl http://169.254.169.254/latest/meta-data/public-hostname',
    {encoding: 'utf-8'},
  );
}
else {
  myIp = '';
}

/* GET home page. */
router.get('/:roomid/latest/:count', function(req, res, next) {
  let count = req.params.count;
  let roomid = req.params.roomid;

  const query = {
    // give the query a unique name
    name: 'fetch-latest-messages',
    text:
      'SELECT id, username, censured, message, roomid, datetime FROM messages WHERE roomid=$1 ORDER BY datetime DESC LIMIT $2',
    values: [roomid, count],
  };
  sendMessages(query, res);
});

async function sendMessages(query, res) {
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
          censured: message.censured,
        });
      });
    }
    res.append('CurrentInstance', myIp);
    res.status(200).send(messages.reverse());
  });
}

router.post('/:roomid/before/:count', function(req, res, next) {
  let count = req.params.count;
  let roomid = req.params.roomid;
  let id = req.body.id;
  const query = {
    // give the query a unique name
    name: 'fetch-before-messages',
    text:
      'SELECT id, username, message, censured, roomid, datetime FROM messages WHERE roomid=$1 AND id<$2 ORDER BY datetime DESC LIMIT $3',
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

router.post('/new', function(req, res, next) {
    // Revisamos el mensaje
    let roomId = req.body.roomId;
    let message = req.body.message;
    let username = req.body.username;
    let encryption = req.body.encrypted;
    let sender = req.body.sender;
    let receiver = req.body.receiver;
    console.log(req.body);
    if(!encryption) {
        var url = process.env.endpoint_aws_comprehend;
        var mensaje_revisar = {
            text: message
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(mensaje_revisar), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                response.json().then((data) => {
                    if (data.Sentiment === "NEGATIVE") {
                        // If file size is larger than expected.
                        message = "****"
                    }
                    insertToDatabase(roomId, message, username).then(r => {
                        if (message.includes('@')) {
                            const space_index = message.indexOf(" ");
                            const username_mention = message.substring(1, space_index);
                            sendNotification(roomId, message, username_mention).then(r => console.log("Notification sent!"));
                        }

                        res.append('CurrentInstance', myIp);
                        res.status(200).send("OK");
                        emitMessageSent(message, username, roomId);
                    });

                });
            }).catch((error) => {
            // If another error
            console.log(`${error}`);
        });
    } else {
        emitEncryptedMessage(message, username, roomId, sender, receiver);
    }
});

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

async function insertToDatabase(roomName, message, username) {
  try {
    // aqui guardas los mensajes
    await client.query('BEGIN');
    const queryText =
      'INSERT INTO messages(username, roomId, message, originalmessage) VALUES($1, $2, $3, $3)';
    const res = await client.query(queryText, [username, roomName, message]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

module.exports = router;
