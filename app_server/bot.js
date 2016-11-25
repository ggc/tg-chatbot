let request = require('request')
var telegraf = require('telegraf')
var mongoose = require('mongoose')
var Task = mongoose.model('Tasks')

var bot = new telegraf(process.env.BOT_TOKEN);

let apiOptions = {
	server: 'http://localhost:5000'
}

var timerId;
function work(ctx) {
	ctx.telegram.sendMessage(ctx.message.chat.id, `> Prepare to sprint, ${ctx.message.from.first_name}`)
	timerId = setTimeout(()=>{
		rest(ctx);
	}, 30*1000);
};
function rest(ctx) {
	ctx.telegram.sendMessage(ctx.message.chat.id, `> Rest ${ctx.message.from.first_name}`);
	timerId = setTimeout(()=>{
		work(ctx);
	}, 5*1000);
};


// Use this to log every message
// bot.on('text', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message))


// Use: /about
// Shows a brief description about bot
bot.command('about', ctx => {
	console.log('/about')
	ctx.reply('Bot telegram to schedule pomodoro and share tasks');
})


// Use: /work
// Start the pomodoro timer. Starts on Rest mode, of course
bot.command('work', ctx => {
	// This msg shows always before the one in work()
	// ctx.reply('Prepare to work'); 
	work(ctx);
})


// Use: /rest
// Ends pomodoro timer
bot.command('rest', ctx => {
	clearTimeout(timerId);
	ctx.reply(`You can go home, ${ctx.message.from.first_name}`);	
});


// Use: /list [options]
bot.command('list', ctx => {
	requestOptions = {
		url: apiOptions.server + '/api/tasks'
	}
	request(requestOptions, (err, res, body) => {
		let taskListRaw = JSON.parse(body);
		let taskList = '';
		// console.log(taskListRaw[0])
		if( res.statusCode === 200 && taskListRaw.length){
			for( let task in taskListRaw) {
				// console.log('>task: ',task)
				taskList += task + ': <b>' + taskListRaw[task].title + '</b>\n\t' + taskListRaw[task].description + '\n'
			}
			ctx.replyWithHTML(taskList);
		}
		else
			ctx.reply("These aren't the tasks you are looking for.")
	})
})


// Use: /add [options] <task_title> [<task_description>]
// Add task to DB
// Options: -l, --local    Default. Used to add personal tasks
bot.command('add', ctx => {
	requestOptions = {
		url: apiOptions.server + '/api/task/',
		method: 'POST'
	}
	request(requestOptions, (err, res, body) => {
		let taskListRaw = JSON.parse(body);
		console.log(taskListRaw[0])
		if( res.statusCode === 200 && taskListRaw.length){
			for( let task in taskListRaw) {
				console.log('>task: ',task)
				ctx.reply(task + ': ' + taskListRaw[task].title + '\n' + taskListRaw[task].description);
			}
		}
		else
			ctx.reply("These aren't the tasks you are looking for.")
	})
});


// Use: /delete [options] ...
bot.command('delete', ctx => {})


// Use: /change [options]
bot.command('change', ctx => {})


// Error handling
bot.catch( (err) => {
	console.log('ERROR from bot', err);
});


bot.startPolling()