var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var sessionFileStore = require('session-file-store')(session)

var singupRouter = require('./routes/signup.js');
var signinRouter = require('./routes/signin.js');
var downloadRouter = require('./routes/download.js');
var getbook = require('./routes/getbook.js');

var app = express();

var identityKey = 'skey';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: identityKey,
  secret: 'gaochao', // 用来对session id相关的cookie进行签名
  store: new sessionFileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
  saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
  resave: false, // 是否每次都重新保存会话，建议false
  cookie: {
    maxAge: 60 * 5 * 1000 // 有效期，单位是毫秒
  }
}));

app.use('/my/signup', singupRouter);
app.use('/my/signin', signinRouter);
app.use('/my/download', downloadRouter);
app.use('/my/getbook', getbook);


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
