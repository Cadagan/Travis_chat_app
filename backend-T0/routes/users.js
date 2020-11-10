
var express = require('express');
var router = express.Router();
const bcrypt = require ('bcrypt');
const {client} = require("../database");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const execSync = require('child_process').execSync;
const jwt = require('jsonwebtoken');

const LOCAL = true;

const keys = require("../oauth_keys");
const { google } = require('../oauth_keys');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

//passport.use(
  //new GoogleStrategy({
      //clientID: keys.google.clientID,
      //clientSecret: keys.google.clientSecret,
      //callbackURL: "http://localhost:3001/users/oathsignup/callback"
  //},
  //function(accessToken, refreshToken, profile, done) {
      //console.log("hoola, in GoogleStrategy");

      //const query = {
        //text: 'SELECT name, username, role, googleId FROM users WHERE googleId = $1',
        //values: [profile.id]
      //};
      //const user = {
        //name: null,
        //username: null,
        //role: null
      //};

      //console.log("Starting query");
      //client.query(query, async(err, queryRes) => {
        //if (err) {
          //return done(err);
        
        //} else {

          //console.log(queryRes);
          
          //if (!queryRes.rowCount) {
            //// Registrar usuario
            //try {
              //const saltRounds = 10;
              //bcrypt.genSalt(saltRounds, function(err, salt) {
                //bcrypt.hash(profile.id, salt, function(err, hash) {
                  //console.log(`Inserting user ${profile.displayName}, ${hash}, ${profile.emails[0].value}, ${profile.id}`);
                  //insertToDatabase(
                    //profile.displayName, profile.displayName, hash, profile.emails[0].value, profile.id
                  //).then(request =>{
                      ////Maybe create a token and send to user?
  
                      //jsonWebToken = jwt.sign({name: profile.displayName, username: profile.displayName, role: 'user'}, keys.jwt);
  
                      //return done(null, {username: profile.displayName, token: jsonWebToken});
                  //});
                //});
              //});
            //} catch(e) {
              //return done(null, false);
            //}

          //} else {
             //// Usuario registrado
            //queryRes.rows.forEach(message=>{
              //user.name = message.name;
              //user.username = message.username;
              //user.role = message.role;
            //});

            //jsonWebToken = jwt.sign({name: user.name, username: user.username, role: user.role}, 'Grupo21-arquiSoft');

            //return done(null, {username: user.username, token: jsonWebToken});
          //}
          
        //}
    //});
    //}
  //)
//);


passport.use(new LocalStrategy(
  function(username, password, done) {
    const query = {
        text: 'SELECT username, hashedpassword, role FROM users WHERE username = $1',
        values: [username]
    };
    const user = {
      username: null,
      hash: null,
      role: null
    };
    client.query(query, async(err, queryRes) => {
        if (err) {
          return done(err);
        } else {
          queryRes.rows.forEach(message=>{
            user.username = message.username;
            user.hash = message.hashedpassword;
            user.role = message.role;
          });
          const valid = await validPassword(password, user.hash);
          console.log(valid);
            if (!user.username) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!valid) {
                console.log("Invalid PASSWORD");
                return done(null, false, { message: 'Incorrect password.' });
            }

            jsonWebToken = jwt.sign({name: user.name, username: user.username, role: user.role}, 'Grupo21-arquiSoft');

            return done(null, {username: user.username, token: jsonWebToken});
        }
    });

    }
    )
);


router.post('/signup', function(req, res, next) {
    console.log(req.body);
  // res.append('CurrentInstance', myIp);
  const saltRounds = 10;
  try {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        insertToDatabase(
          req.body.name, req.body.username, hash, req.body.email, null
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

router.post('/signin', passport.authenticate('local', { failureRedirect: '/sign-in', failureFlash: true }),(req, res, next) => {
    // res.append('CurrentInstance', myIp);

    req.session.save((err) => {
        if (err) {
            return next(err);
        }

        const data = {sessionID: req.sessionID, username: req.user.username, token: req.user.token};
        res.status(200).send(JSON.stringify(data));
    });
});

router.get("/oathsignup", passport.authenticate("google", {scope: ['profile', 'email']}));

router.get('/oathsignup/callback', passport.authenticate('google', { successRedirect: 'http://localhost:3000/', failureRedirect: 'http://localhost:3000/sign-in'}), (req, res, next) => {
    console.log("hola in /oathsignup/callback");
    req.session.save((err) => {
      if (err) {
          return next(err);
      }

      const data = {sessionID: req.sessionID, username: req.user.username, token: req.user.token};
      res.status(200).send(JSON.stringify(data));
  });
});

router.post('/logout', function(req, res, next){
    // res.append('CurrentInstance', myIp);
    req.logout();
    req.session.destroy();
    res.status(200).send("OK");
});

router.get('/username', function (req, res, next) {
    // res.append('CurrentInstance', myIp);
    console.log(req.user);
   if(!req.user){
       console.log("User not logged in");
   } else {
       const data = {username: req.user.username};
       res.status(200).send(JSON.stringify(data));
   }
});

async function insertToDatabase(name, username, hashedPassword, email, googleId){
    console.log(`Inserting new user: '${username}'`);
  try {

    await client.query('BEGIN');

    if (googleId) {
      const queryText = 'INSERT INTO users(name, username, hashedpassword, email, googleId) VALUES($1, $2, $3, $4, $5)';
      const res = await client.query(
        queryText,
        [name, username, hashedPassword, email, googleId]
      );
      console.log(res);
      await client.query('COMMIT');
    } else {
      const queryText = 'INSERT INTO users(name, username, hashedpassword, email) VALUES($1, $2, $3, $4)';
      const res = await client.query(
        queryText,
        [name, username, hashedPassword, email]
      );
      console.log(res);
      await client.query('COMMIT');
    }

  } catch (e) {
    await client.query('ROLLBACK');
    throw e
  }
}

module.exports = router;
