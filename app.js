'use strict';
var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	Telegraf = require('telegraf');


var index = require('./routes/index');

var app = express();
console.log('> Token: ' + process.env.BOT_TOKEN)
var bot = new Telegraf(process.env.BOT_TOKEN);

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
bot.on('text', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message))
bot.startPolling()

// Shows a brief description about bot
bot.command('about', ctx => {
	ctx.reply('Bot telegram to schedule pomodoro and share tasks');
})
// Start the pomodoro timer. Starts on Rest mode, of course
//TODO: Move to /start command
bot.command('work', ctx => {
	ctx.reply('Work!');
	// work();
})
// Ends pomodoro timer
bot.command('rest', ctx => {
	clearTimeout(timerId);
	ctx.reply(`You can go home, ${msg.from.first_name}`);	
});

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
