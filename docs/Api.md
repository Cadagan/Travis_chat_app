# Api documentación

---
#### URL :${BACKEND_HOST}/rooms`
#### GET:

#### Success Response
```
Array of rooms.
```
---
router.get('/users/latest/:count', function(req, res, next) {
});
#### URL :${BACKEND_HOST}/users/latest/:count`
#### GET:

#### Success Response
```
Array of rooms.
```
---
#### URL :${BACKEND_HOST}/admin/editUsername`
#### POST:

#### Success Response
```
```

router.post('/editUsername', function(req, res, next) {
  let username = req.body.username;
  let id = req.body.id;
});


router.post('/users/before/:count', function(req, res, next) {
  let count = req.params.count;
  let id = req.body.id;
});

---
#### URL :${BACKEND_HOST}/users/before/:count`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/users/before/:count', function(req, res, next) {
  let count = req.params.count;
  let id = req.body.id;
});


router.post('/editUsername', function(req, res, next) {
  let username = req.body.username;
  let id = req.body.id;
});
---
#### URL :${BACKEND_HOST}/admin/editName`
#### POST:

#### Success Response
```
Array of rooms.
```


router.post('/editName', function(req, res, next) {
  let name = req.body.name;
  let id = req.body.id;
  try {
    editName(name, id);
  } catch (error) {
  }
});

---

#### URL :${BACKEND_HOST}/admin/editEmail`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/editEmail', function(req, res, next) {
  let email = req.body.email;
  let id = req.body.id;
  try {
    editEmail(email, id);
  } catch (error) {
  }
});

---

#### URL :${BACKEND_HOST}/admin/editRole`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/editRole', function(req, res, next) {
  let role = req.body.role;
  let id = req.body.id;
  try {
    editRole(role, id);
  } catch (error) {
  }
});

---

#### URL :${BACKEND_HOST}/admin/editGoogleid`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/editGoogleid', function(req, res, next) {
  let googleid = req.body.googleid;
  let id = req.body.id;
  try {
    editGoogleid(googleid, id);
  } catch (error) {
  }
});

---

#### URL :${BACKEND_HOST}/admin/deleteRoom`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/deleteRoom', function(req, res, next) {
  let roomId = req.body.roomid;
  try {
    deleteRoom(roomId);
  } catch (error) {
  }
});

---

#### URL :${BACKEND_HOST}/admin/togglePrivate`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/togglePrivate', function(req, res, next) {
  let roomId = req.body.roomid;
  try {
    deleteRoom(roomId);
  } catch (error) {
  }
});

---

#### URL :${BACKEND_HOST}/admin/editMessage`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/editMessage', function(req, res, next) {
  let messageId = req.body.id;
  let message = req.body.message;
  try {
    editMessage(message, messageId);
  } catch (error) {
  }
});

---

#### URL :${BACKEND_HOST}/admin/censureMessage`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/censureMessage', function(req, res, next) {
  let messageId = req.body.id;
  try {
    censureMessage(messageId);
  } catch (error) {
  }
});

---

#### URL :${BACKEND_HOST}/encryption/public_key`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/public_key', function(req, res, next) {
  let publicKey = req.body.publicKey;
  let username = req.body.username;
  let roomId = req.body.roomId;
  let sender = req.body.sender;

  emitAuthMessageToRoom(message, roomId);
  res.append('CurrentInstance', myIp);
  res.status(200).send(object);
});

---

#### URL :${BACKEND_HOST}/messages/:roomid/before/:count`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/:roomid/before/:count', function(req, res, next) {
  let count = req.params.count;
  let roomid = req.params.roomid;
  let id = req.body.id;
    name: 'fetch-before-messages',
  };

  sendMessages(query, res);
});

---

#### URL :${BACKEND_HOST}/messages/new`
#### POST:

#### Success Response
```
Array of rooms.
```


router.post('/new', function(req, res, next) {
    let roomId = req.body.roomId;
    let message = req.body.message;
    let username = req.body.username;
    let encryption = req.body.encrypted;
    let sender = req.body.sender;
    let receiver = req.body.receiver;
    if(!encryption) {
        var url = process.env.endpoint_aws_comprehend;
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                response.json().then((data) => {
                    if (data.Sentiment === "NEGATIVE") {
                        message = "****"
                    }
                    insertToDatabase(roomId, message, username).then(r => {
                        if (message.includes('@')) {
                            const space_index = message.indexOf(" ");
                            const username_mention = message.substring(1, space_index);
                        }

                        res.append('CurrentInstance', myIp);
                        res.status(200).send("OK");
                        emitMessageSent(message, username, roomId);
                    });

                });
            }).catch((error) => {
        });
    } else {
        emitEncryptedMessage(message, username, roomId, sender, receiver);
    }
});

---

#### URL :${BACKEND_HOST}/messages/:roomid/latest/:count`
#### GET:

#### Success Response
```
Array of rooms.
```

router.get('/:roomid/latest/:count', function(req, res, next) {
  let count = req.params.count;
  let roomid = req.params.roomid;

    name: 'fetch-latest-messages',
  };
  sendMessages(query, res);
});


router.get(
  '/oathsignup',
  passport.authenticate('google', {scope: ['profile', 'email']}),
);


router.get(
  '/oathsignup/callback',
  passport.authenticate('google', {
  }),
  (req, res, next) => {
    req.session.save(err => {
      if (err) {
        return next(err);
      }

        sessionID: req.sessionID,
        username: req.user.username,
        token: req.user.token,
      };
      res.status(200).send(JSON.stringify(data));
    });
  },
);

---

#### URL :${BACKEND_HOST}/users/username`
#### GET:

#### Success Response
```
Array of rooms.
```

router.get('/username', function(req, res, next) {
  if (!req.user) {
  } else {
    res.status(200).send(JSON.stringify(data));
  }
});

---

#### URL :${BACKEND_HOST}/users/signup`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/signup', function(req, res, next) {
  const saltRounds = 10;
  try {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        insertToDatabase(
          req.body.name,
          req.body.username,
          hash,
          req.body.email,
          null,
        ).then(request => {
          res.status(200).send('OK');
        });
      });
    });
  } catch (e) {
    res.status(422).send('Could not add body to database');
  }
});

---

#### URL :${BACKEND_HOST}/users/signin`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/sign-in',
    failureFlash: true,
  }),
  (req, res, next) => {

    req.session.save(err => {
      if (err) {
        return next(err);
      }

      getUserRole(req.user.username).then(role => {
          sessionID: req.sessionID,
          username: req.user.username,
          token: req.user.token,
          role: role,
        };
        res.status(200).send(JSON.stringify(data));
      });
    });
  },
);

---

#### URL :${BACKEND_HOST}/users/logout`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.status(200).send('OK');
});

---

#### URL :${BACKEND_HOST}/users/signup`
#### POST:

#### Success Response
```
Array of rooms.
```

router.post('/signup', function(req, res, next) {
  const saltRounds = 10;
  try {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        insertToDatabase(
          req.body.name,
          req.body.username,
          hash,
          req.body.email,
          null,
        ).then(request => {
          res.status(200).send('OK');
        });
      });
    });
  } catch (e) {
    res.status(422).send('Could not add body to database');
  }
});

---
