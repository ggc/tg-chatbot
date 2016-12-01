'use strict';
let express = require('express'),
	path = require('path'),
	fs = require('fs'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	githubStrategy = require('passport-github').Strategy
// fs.stat('.env', (err, stat) => {
// 	if(err == null)
		require('dotenv').config()
	// else if(err.code == 'ENOENT')
	// 	console.log('ERROR: .env doesn\'t exist')
// })
require('./app_api/models/db')
require('./app_server/bot')
require('./app_server/passport-config')(passport)

// let routes = require('./app_server/routes/index')
let routesAPI = require('./app_api/routes/index')

let app = express();

let workTime;

// view engine setup
app.set('views', path.join(__dirname, 'app_client', 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize())
app.use(passport.session())

let routes = require('./app_server/routes/index')(passport)
app.use('/', routes);
app.use('/api', routesAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
