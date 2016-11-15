'use strict';
var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	TeleBot = require('telebot');


var index = require('./routes/index'),
	users = require('./routes/users');

var app = express();
//TODO: Take out token
var bot = new TeleBot({
	token: process.env.TG_TOKEN
});

var workTime;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var timerId;
function work(msg) {
	bot.sendMessage(msg.chat.id, '> Prepare to sprint');
	timerId = setTimeout(()=>{
		rest(msg);
	}, 30*1000);
};
function rest(msg) {
	bot.sendMessage(msg.chat.id, '> Rest');
	timerId = setTimeout(()=>{
		work(msg);
	}, 5*1000);
};

// Use this to log every message
bot.on('text', msg => {

	console.log(`[msg] ${ msg.chat.id } ${ msg.text }`);
});
// Shows a brief description about bot
bot.on('/about', msg => {
	return bot.sendMessage(msg.chat.id, 'This is suppose to improve work');
});
// Start the pomodoro timer. Starts on Rest mode, of course
//TODO: Move to /start command
bot.on('/work', msg => {
	work(msg);
})
// Ends pomodoro timer
bot.on('/rest', msg => {
	clearTimeout(timerId);
	return bot.sendMessage(msg.chat.id, `You can go home, ${msg.from.first_name}`);	
});
// Command to set time intervals and modes
bot.on('/config', msg => {

});
// Add task to the DB
bot.on('/add', msg => {
	
});
// Show own tasks
bot.on('/show', msg => {
	
});

bot.connect();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
