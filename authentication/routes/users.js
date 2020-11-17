var express = require('express');
var router = express.Router();
const bcrypt = require ('bcrypt');
const {client} = require("../database");
var passport = require('passport');
const keys = require("../oauth_keys");
const GoogleStrategy = require('passport-google-oauth2' ).Strategy;
var GoogleTokenStrategy = require('passport-google-token').Strategy;
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

var { generateToken, sendToken } = require('../utils/token.utils');

let user_auth = {};

router.use(function(req, res, next) {
  //const allowedOrigins = ['http://localhost:3000', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  console.log(`Origin request: ${req.headers.origin}`);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



async function validPassword(password, hash){
    return bcrypt.compare(password, hash);
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleTokenStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
},
function (accessToken, refreshToken, profile, done) {

        console.log("running google strategy");

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
                    console.log("Inserting into database google user");
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
}));

router.post('/auth/google', (passport.authenticate('google-token', {session: false}), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };

        next();
    }, generateToken, sendToken));


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
/*
passport.use(new GoogleStrategy({
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "http://localhost:3002/users/auth/google/callback",
      //passReqToCallback: true
  },
  function(accessToken, refreshToken, profile, done) {

      console.log("running google strategy");

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
                  console.log("Inserting into database google user");
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
    })
);
*/

router.get("/login/success", function(req, res) {
  console.log("/login/success")
  console.log(user_auth);
  if (user_auth){
    res.status(200).send(JSON.stringify(user_auth));
  }
})

// router.get("/auth/google", passport.authenticate("google", {scope: ['profile', 'email']}));
/*
router.get(
  '/auth/google/callback',
  function(req, res, next) {
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      successRedirect: 'http://localhost:3000/',
      failureRedirect: 'http://localhost:3000/sign-up'},
      (err, user, info) => {
        console.log(req);
        req.session.save((err) => {
          if (err) {
              return next(err);
          }
          console.log("REQ.USER:")
          console.log(req.user);
          //req.body = data
          const data = {sessionID: req.sessionID, username: user.username, token: user.token};
          user_auth = data;
          res.status(200).send(JSON.stringify(data));
          // return 
          // res.redirect('http://localhost:3000/sign-in');
    });
  })(req, res, next);
});
*/
/*
router.get(
  '/auth/google/callback',
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      //bsuccessRedirect: 'http://localhost:3000/sign-in',
      failureRedirect: 'http://localhost:3000/sign-up',
      session: false}),
      (req, res) => {
        console.log("req:")
        console.log(req);
        console.log("res:")
        console.log(res);
      }
  );
*/
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
