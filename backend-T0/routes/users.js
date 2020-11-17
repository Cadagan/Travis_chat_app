var express = require('express');
var router = express.Router();
const bcrypt = require ('bcrypt');
const {client} = require("../database");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const execSync = require('child_process').execSync;
const jwt = require('jsonwebtoken');
const {LOCAL} = require("../bin/www");


var myIp;

if (!LOCAL) {
  myIp = execSync(
      'curl http://169.254.169.254/latest/meta-data/public-hostname',
      { encoding: 'utf-8' }
    );
} else {
  myIp = '';
}
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

module.exports = router;