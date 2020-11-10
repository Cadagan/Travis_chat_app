var express = require('express');
var router = express.Router();
const bcrypt = require ('bcrypt');
const {client} = require("../database");
var passport = require('passport');
const keys = require("../oauth_keys");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
  //const allowedOrigins = ['http://localhost:3000', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  console.log(req.headers.origin);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy({
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "http://localhost:3002/users/oathsignup/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log("hoola, in GoogleStrategy");

      const query = {
        text: 'SELECT name, username, role, googleId FROM users WHERE googleId = $1',
        values: [profile.id]
      };
      const user = {
        name: null,
        username: null,
        role: null
      };

      console.log("Starting query");
      client.query(query, async(err, queryRes) => {
        if (err) {
          return done(err);
        
        } else {          
          if (!queryRes.rowCount) {
            // Registrar usuario
            try {
              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(profile.id, salt, function(err, hash) {
                  console.log(`Inserting user ${profile.displayName}, ${hash}, ${profile.emails[0].value}, ${profile.id}`);
                  insertToDatabase(
                    profile.displayName, profile.displayName, hash, profile.emails[0].value, profile.id
                  ).then(request =>{
  
                      jsonWebToken = jwt.sign({name: profile.displayName, username: profile.displayName, role: 'user'}, keys.jwt);

                      console.log("Before send user just registered information");

                      return done(null, {username: profile.displayName, token: jsonWebToken});
                  });
                });
              });
            } catch(e) {
              return done(null, false);
            }

          } else {
             // Usuario registrado
            queryRes.rows.forEach(message=>{
              user.name = message.name;
              user.username = message.username;
              user.role = message.role;
            });

            jsonWebToken = jwt.sign({name: user.name, username: user.username, role: user.role}, 'Grupo21-arquiSoft');

            console.log("Before send user already registered information");

            return done(null, {username: user.username, token: jsonWebToken});
          }
          
        }
    });
    }
  )
);

router.get("/oathsignup", passport.authenticate("google", {scope: ['profile', 'email']}));

router.get(
  '/oathsignup/callback',
  function(req, res, next) {

    passport.authenticate('google', { 
      // TODO : http://localhost:3000 -> Local
      scope: ['profile', 'email'],
      failureRedirect: 'http://localhost:3000/sign-up'}, (err, user, info) => {
        req.session.save((err) => {
          if (err) {
              return next(err);
          }
          const data = {sessionID: req.sessionID, username: user.username, token: user.token};
          res.status(200).send(JSON.stringify(data));
          // return 
          // res.redirect('http://localhost:3000')
      });
    })(req, res, next);
  });

async function insertToDatabase(name, username, hashedPassword, email, googleId){
  
  console.log(`Inserting new user: '${username}'`);
  try {

    await client.query('BEGIN');
    const queryText = 'INSERT INTO users(name, username, hashedpassword, email, googleId) VALUES($1, $2, $3, $4, $5)';
    const res = await client.query(
      queryText,
      [name, username, hashedPassword, email, googleId]
    );
    console.log(res);
    await client.query('COMMIT');

  } catch (e) {
    await client.query('ROLLBACK');
    throw e
  }
}


module.exports = router;
