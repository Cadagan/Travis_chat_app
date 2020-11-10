var express = require('express');
var router = express.Router();
const bcrypt = require ('bcrypt');
const {client} = require("../database");
var passport = require('passport');
const keys = require("../oauth_keys");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const jwt = require('jsonwebtoken');

let user_auth = {};

router.use(function(req, res, next) {
  //const allowedOrigins = ['http://localhost:3000', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  console.log(`Origin request: ${req.headers.origin}`);
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

passport.use(new GoogleStrategy({
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "http://localhost:3000/sign-in",
      passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {

      const query = {
        text: 'SELECT name, username, role, googleId FROM users WHERE googleId = $1',
        values: [profile.id]
      };
      const user = {
        name: null,
        username: null,
        role: null
      };
      client.query(query, async(err, queryRes) => {
        if (err) {
          return done(err);
        
        } else {          
          if (!queryRes.rowCount) {
            // Registrar usuario
            try {
                  insertToDatabase(
                    profile.displayName, profile.displayName, "INVALIDHASH", profile.emails[0].value, profile.id
                  ).then(request =>{
  
                      const jsonWebToken = jwt.sign({name: profile.displayName, username: profile.displayName, role: 'user'}, keys.jwt);

                      console.log("Before send user just registered information");

                      return done(null, {username: profile.displayName, token: jsonWebToken});
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

            const jsonWebToken = jwt.sign({name: user.name, username: user.username, role: user.role}, keys.jwt);
            console.log("Before send user already registered information");
            return done(null, {username: user.username, token: jsonWebToken});
          }
        }
    });
    }
  )
);

router.get("/login/success", function(req, res) {
  console.log("/login/success")
  console.log(user_auth);
  if (user_auth){
    res.status(200).send(JSON.stringify(user_auth));
  }
})

router.get("/auth/google", passport.authenticate("google", {scope: ['profile', 'email']}));

router.get(
  '/auth/google/callback',
    passport.authenticate( 'google', {
      successRedirect: '/auth/google/success',
      failureRedirect: '/auth/google/failure'
    }));

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
