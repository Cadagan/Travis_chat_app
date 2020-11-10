var express = require('express');
var router = express.Router();
const bcrypt = require ('bcrypt');
const {client} = require("../database");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const execSync = require('child_process').execSync;
const jwt = require('jsonwebtoken');

const LOCAL = true;

if (!LOCAL) {
  var myIp = execSync(
      'curl http://169.254.169.254/latest/meta-data/public-hostname',
      { encoding: 'utf-8' }
    );
}

async function validPassword(password, hash){
  return bcrypt.compare(password, hash);
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    const query = {
      text:
        'SELECT username, hashedpassword, role FROM users WHERE username = $1',
      values: [username],
    };
    const user = {
      username: null,
      hash: null,
      role: null,
    };
    client.query(query, async (err, queryRes) => {
      if (err) {
        return done(err);
      } else {
        queryRes.rows.forEach(message => {
          user.username = message.username;
          user.hash = message.hashedpassword;
          user.role = message.role;
        });
        const valid = await validPassword(password, user.hash);
        console.log(valid);
        if (!user.username) {
          return done(null, false, {message: 'Incorrect username.'});
        }
        if (!valid) {
          console.log('Invalid PASSWORD');
          return done(null, false, {message: 'Incorrect password.'});
        }

        jsonWebToken = jwt.sign(
          {name: user.name, username: user.username, role: user.role},
          'Grupo21-arquiSoft',
        );

        return done(null, {username: user.username, token: jsonWebToken});
      }
    });
  }),
);

router.post('/signup', function(req, res, next) {
  console.log(req.body);
  // res.append('CurrentInstance', myIp);
  const saltRounds = 10;
  try {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        insertToDatabase(
          req.body.name, req.body.username, hash, req.body.email
        ).then(request =>{
            //Maybe create a token and send to user?
            res.status(200).send("OK");
        });
      });
    });
  } catch (e) {
    res.status(422).send('Could not add body to database');
  }
});

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/sign-in',
    failureFlash: true,
  }),
  (req, res, next) => {
    // res.append('CurrentInstance', myIp);

    req.session.save(err => {
      if (err) {
        return next(err);
      }

      getUserRole(req.user.username).then(role => {
        const data = {
          sessionID: req.sessionID,
          username: req.user.username,
          token: req.user.token,
          role: role,
        };
        console.log(`The role sent with signin is: ${role}`);
        res.status(200).send(JSON.stringify(data));
      });
    });
  },
);

router.get(
  '/oathsignup',
  passport.authenticate('google', {scope: ['profile', 'email']}),
);

router.get(
  '/oathsignup/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: 'http://localhost:3000/sign-in',
  }),
  (req, res, next) => {
    console.log('hola in /oathsignup/callback');
    req.session.save(err => {
      if (err) {
        return next(err);
      }

      const data = {
        sessionID: req.sessionID,
        username: req.user.username,
        token: req.user.token,
      };
      res.status(200).send(JSON.stringify(data));
    });
  },
);

router.post('/logout', function(req, res, next) {
  // res.append('CurrentInstance', myIp);
  req.logout();
  req.session.destroy();
  res.status(200).send('OK');
});

router.get('/username', function(req, res, next) {
  // res.append('CurrentInstance', myIp);
  console.log(req.user);
  if (!req.user) {
    console.log('User not logged in');
  } else {
    const data = {username: req.user.username};
    res.status(200).send(JSON.stringify(data));
  }
});

async function insertToDatabase(name, username, hashedPassword, email){
  console.log(`Inserting new user: '${username}'`);
  try {
    await client.query('BEGIN');
      const queryText = 'INSERT INTO users(name, username, hashedpassword, email) VALUES($1, $2, $3, $4)';
      const res = await client.query(
        queryText,
        [name, username, hashedPassword, email]
      );
      console.log(res);
      await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

async function getUserRole(username) {
  console.log(`Getting user role of username: ${username}`);
  const query = {
    text: 'SELECT role FROM users WHERE username=$1',
    values: [username],
  };
  return client.query(query).then((queryRes, err) => {
    if (err) {
      console.log('Error getting username from database');
      return null;
    } else {
      if (queryRes.rows[0]) {
        console.log(`Found role: ${queryRes.rows[0].role}`);
        return queryRes.rows[0].role;
      } else {
        console.log('No username found with that name');
        return null;
      }
    }
  });
}

module.exports = router;