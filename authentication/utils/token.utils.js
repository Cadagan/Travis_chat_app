const jwt = require("jsonwebtoken");
var createToken = function(auth) {
    return jwt.sign({
            username: auth.username,
            role: auth.role,
        }, 'keyboard-bongo-cat',
        {
            expiresIn: 60 * 120
        });
};

module.exports = {
  generateToken: function(req, res, next) {
      console.log("Generating token", req.auth);
      req.token = createToken(req.auth);
      console.log("Generated token", req.token);
      return next();
  },
  sendToken: function(req, res) {
      res.setHeader('x-auth-token', req.token);
      return res.status(200).send(JSON.stringify(req.user));
  }
};