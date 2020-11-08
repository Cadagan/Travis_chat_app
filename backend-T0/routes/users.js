var express = require('express');
var router = express.Router();
const bcrypt = require ('bcrypt');
const {client} = require("../database");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const execSync = require('child_process').execSync;
var myIp = execSync(
  'curl http://169.254.169.254/latest/meta-data/public-hostname',
  { encoding: 'utf-8' }
);

async function validPassword(password, hash){
  var out = false;
  bcrypt.compare(password, hash, function(err, result) {
    if (result) {
      out = true;
    }
  });
  return out;
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
        text: 'SELECT username, hashedpassword FROM users WHERE username = $1',
        values: [username]
    };
    const user = {
      username: null,
      hash: null,
    };
    client.query(query, (err, queryRes) => {
        if (err) {
          return done(err);
        } else {
          queryRes.rows.forEach(message=>{
            user.username = message.username;
            user.hash = message.hashedpassword;
          });
            if (!user.username) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!validPassword(user.password, user.hash)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, {username: user.username});
        }
    });

    }
    )
);


router.post('/signup', function(req, res, next) {
    console.log(req.body);
  res.append('CurrentInstance', myIp);
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
  }
  catch(e) {
    res.status(422).send("Could not add body to database");
  }
});

router.post('/signin', passport.authenticate('local', { failureRedirect: '/?error=LoginError', failureFlash: true }),(req, res, next) => {
    res.append('CurrentInstance', myIp);
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        const data = {sessionID: req.sessionID, username: req.user.username};
        res.status(200).send(JSON.stringify(data));
    });
});


router.post('/oathsignup',
  passport.authenticate('local', { successRedirect: '/',
                                 failureRedirect: '/',
                                 failureFlash: true }),
  function(req, res, next) {
    res.append('CurrentInstance', myIp);
    res.status(200).send("OK");
  //TODO: Add correct failure redirect
  //TODO: Redirect probably won't work on backend?
});


router.post('/logout', function(req, res, next){
    res.append('CurrentInstance', myIp);
    req.logout();
    req.session.destroy();
    res.status(200).send("OK");
});

router.get('/username', function (req, res, next) {
    res.append('CurrentInstance', myIp);
    console.log(req.user);
   if(!req.user){
       console.log("User not logged in");
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
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e
  }
}

module.exports = router;
