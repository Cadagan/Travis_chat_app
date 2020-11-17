require('dotenv').config();
var express = require('express');
var router = express.Router();
const {client} = require('../database');
//const {emitMessageSent} = require('../websocket');
let AWS = require('aws-sdk');
const fetch = require('node-fetch');
const execSync = require('child_process').execSync;

const {LOCAL} = require("../bin/www");

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

router.post('/editUsername', function(req, res, next) {
  let username = req.body.username;
  let id = req.body.id;
  try {
    console.log(`editing username, username: ${username}, id: ${id}`);
    setUsername(username, id);
  } catch (error) {
    console.log(error);
  }
});
router.post('/editName', function(req, res, next) {
  let name = req.body.name;
  let id = req.body.id;
  try {
    console.log(`editing name, name: ${name}, id: ${id}`);
    editName(name, id);
  } catch (error) {
    console.log(error);
  }
});
router.post('/editEmail', function(req, res, next) {
  let email = req.body.email;
  let id = req.body.id;
  try {
    console.log(`editing email, email: ${email}, id: ${id}`);
    editEmail(email, id);
  } catch (error) {
    console.log(error);
  }
});
router.post('/editRole', function(req, res, next) {
  let role = req.body.role;
  let id = req.body.id;
  try {
    console.log(`editing role, role: ${role}, id: ${id}`);
    editRole(role, id);
  } catch (error) {
    console.log(error);
  }
});
router.post('/editGoogleid', function(req, res, next) {
  let googleid = req.body.googleid;
  let id = req.body.id;
  try {
    console.log(`editing googleid, googleid: ${googleid}, id: ${id}`);
    editGoogleid(googleid, id);
  } catch (error) {
    console.log(error);
  }
});
router.post('/deleteRoom', function(req, res, next) {
  let roomId = req.body.roomid;
  try {
    console.log(`deleting room roomId: ${roomId}`);
    deleteRoom(roomId);
  } catch (error) {
    console.log(error);
  }
});

router.post('/togglePrivate', function(req, res, next) {
  let roomId = req.body.roomid;
  try {
    console.log(`Toggling private for: ${roomId}`);
    deleteRoom(roomId);
  } catch (error) {
    console.log(error);
  }
});

router.post('/editMessage', function(req, res, next) {
  let messageId = req.body.id;
  let message = req.body.message;
  try {
    console.log(`editing message for: ${messageId}`);
    editMessage(message, messageId);
  } catch (error) {
    console.log(error);
  }
});

router.post('/censureMessage', function(req, res, next) {
  let messageId = req.body.id;
  try {
    console.log(`Censuring message for  ${messageId}`);
    censureMessage(messageId);
  } catch (error) {
    console.log(error);
  }
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

async function setUsername(username, id) {
  try {
    await client.query('BEGIN');
    const queryText = 'UPDATE users SET username=$1 WHERE id=$2';
    const res = await client.query(queryText, [username, id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}
async function editName(name, id) {
  try {
    await client.query('BEGIN');
    const queryText = 'UPDATE users SET name=$1 WHERE id=$2';
    const res = await client.query(queryText, [name, id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}
async function editEmail(email, id) {
  try {
    await client.query('BEGIN');
    const queryText = 'UPDATE users SET email=$1 WHERE id=$2';
    const res = await client.query(queryText, [email, id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}
async function editRole(role, id) {
  try {
    await client.query('BEGIN');
    const queryText = 'UPDATE users SET role=$1 WHERE id=$2';
    const res = await client.query(queryText, [role, id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}
async function editGoogleid(googleid, id) {
  try {
    await client.query('BEGIN');
    const queryText = 'UPDATE users SET googleid=$1 WHERE id=$2';
    const res = await client.query(queryText, [username, id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

async function deleteRoom(roomId) {
  try {
    await client.query('BEGIN');
    const queryText = 'DELETE FROM rooms WHERE id=$1';
    const res = await client.query(queryText, [roomId]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

async function editMessage(message, id) {
  try {
    await client.query('BEGIN');
    const queryText = 'UPDATE messages SET message=$1 WHERE id=$2';
    const res = await client.query(queryText, [message, id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

async function censureMessage(id) {
  try {
    await client.query('BEGIN');
    const queryText = 'UPDATE messages SET censured=$1 WHERE id=$2';
    const res = await client.query(queryText, [true, id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

module.exports = router;
