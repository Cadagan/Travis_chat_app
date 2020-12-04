var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var cors = require('cors');
var passport = require('passport');

var messagesRouter = require('./routes/messages');
var usersRouter = require('./routes/users');
var roomsRouter = require('./routes/rooms');
var encryptionRouter = require('./routes/encryption');
var adminRouter = require('./routes/admin');
const {LOCAL} = require("./bin/www");

var app = express();
app.use(
  cors({
    origin: LOCAL?'http://localhost:3000':"https://www.grupo21frontend.ml", // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  }),
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  }),
);
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/messages', messagesRouter);
app.use('/rooms', roomsRouter);
app.use('/users', usersRouter);
app.use('/encryption', encryptionRouter);
app.use('/admin', adminRouter);

module.exports = app;
