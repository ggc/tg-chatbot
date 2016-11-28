let request = require('request')
let telegraf = require('telegraf')
let mongoose = require('mongoose')
let Task = mongoose.model('Tasks')

let bot = new telegraf(process.env.BOT_TOKEN)
console.log('bot_token:',process.env.BOT_TOKEN)

let apiOptions = {
	server: 'http://localhost:5000'
}

let timerId;
function work(ctx) {
	ctx.telegram.sendMessage(ctx.message.chat.id, `> Prepare to sprint, ${ctx.message.from.first_name}`)
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
			ctx.reply("No tasks added")
		
		timerId = setTimeout(()=>{
			rest(ctx);
		}, 30*1000);
	})
};
function rest(ctx) {
	ctx.telegram.sendMessage(ctx.message.chat.id, `> Rest ${ctx.message.from.first_name}`);
	timerId = setTimeout(()=>{
		work(ctx);
	}, 5*1000);
};


bot.on('inline_query', (ctx) => {
	let query = ctx.inlineQuery.query
	let cmdIndex = query.indexOf(' ') < 1 ? query.length : query.indexOf(' ')
	let cmd = query.substr( 0, cmdIndex )
	query = query.substr( cmdIndex )
	console.log('> inline ', cmd, query)
	switch(cmd){
		case 'list': 
			let queryAnswer = []
			requestOptions = {
				url: apiOptions.server + '/api/tasks'
			}
			request(requestOptions, (err, res, body) => {
				let taskListRaw = JSON.parse(body);
				let taskList = '';
				if( res.statusCode === 200 && taskListRaw.length){
					for( let task in taskListRaw) {
						queryAnswer.push({
							id: taskListRaw[task]._id,
							title: taskListRaw[task].title,
							description:taskListRaw[task].description,
							url: 'https://www.google.com',
							type: 'article',
							input_message_content:{
								message_text: 'Redirecting to google...'
							}
						})
					}
					ctx.answerInlineQuery(queryAnswer)
				}
				else
					ctx.answerInlineQuery("These aren't the tasks you are looking for.")
			})
			break;
		case 'add':
			let task = query.split(' - ')
			ctx.answerInlineQuery([
			{
				id: task[0],
				title: task[0],
				description: task[1],
				type: 'article',
				input_message_content:{
					message_text: 'A donde vamos?'
				},
				reply_markup: {
					inline_keyboard: [
						[{text: 'Google', url: 'www.google.com'},
						{text: 'Thomman guitars', url: 'www.thomman.com'}]
					]
				}
			}])
			break;
		case 'delete':
			break;
		case 'work':
			break;
		case 'rest':
			break;
		// TODO: complete
		default:
			return ctx.answerInlineQuery([])
			break;
	}
})

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
	let task = ctx.message.text.split(' - ')
	if(task.length < 2)
		ctx.reply("Use it like this: \n/add <task_name> - <task_description>")
	requestOptions = {
		url: apiOptions.server + '/api/task/',
		method: 'POST',
		json: {
			title: task[0].substring(4),
			description: task.length>1 ? task[1] : ''
		}
	}
	request(requestOptions,( err, res, body) => {

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