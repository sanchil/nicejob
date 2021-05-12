require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Firestore } = require('@google-cloud/firestore');
const session = require('express-session');
const { FirestoreStore } = require('@google-cloud/connect-firestore');

const redis = require("redis");
const redisClient = redis.createClient(6379);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(session({
  store: new FirestoreStore({
    dataset: new Firestore(),
    kind: 'express-sessions'
  }),
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true
}));

redisClient.on("error", function (error) {
  console.error(error);
});
console.log("Processe Cache expiry: ", parseInt(process.env.NICEAPP_CACHE_MAX_AGE));

const cache_expire = parseInt(process.env.NICEAPP_CACHE_MAX_AGE);

var cache = cachetimeout => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;
    redisClient.get(key, (err, cachedBody) => {
      if (err) {
        res.sendResponse = res.send;
        res.send = body => {
          redisClient.set(key, body);
          redisClient.expire(key, cachetimeout * 1000);
          res.sendResponse(body);
        };
      }
      if (cachedBody) {
        res.send(cachedBody);
        return;
      } else {
        res.sendResponse = res.send;
        res.send = body => {
          redisClient.set(key, body);
          redisClient.expire(key, cachetimeout * 1000);
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', cache(cache_expire), indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;