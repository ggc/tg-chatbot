var telegraf = require('telegraf')
var mongoose = require('mongoose')
var Task = mongoose.model('Tasks')

var bot = new telegraf(process.env.BOT_TOKEN);
console.log('> Token: ' + process.env.BOT_TOKEN)

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
bot.on('text', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message))

// Shows a brief description about bot
bot.command('about', ctx => {
	console.log('/about')
	ctx.reply('Bot telegram to schedule pomodoro and share tasks');
})
// Start the pomodoro timer. Starts on Rest mode, of course
//TODO: Move to /start command
bot.command('work', ctx => {
	// This msg shows always before the one in work()
	// ctx.reply('Prepare to work'); 
	work(ctx);
})
// Ends pomodoro timer
bot.command('rest', ctx => {
	clearTimeout(timerId);
	ctx.reply(`You can go home, ${ctx.message.from.first_name}`);	
});
// Add tasks
bot.command('add', ctx => {
	ctx.reply(`args: ${ctx.message.text}`)
	Task.create({
		title: "Remove hardcoded info",
		description: "Change this task info for msg arguments"
	});
});
bot.command('list', ctx => {
	ctx.reply(Task.find());
})
bot.command('delete', ctx => {})
bot.command('change', ctx => {})

// Error handling
bot.catch( (err) => {
	console.log('ERROR from bot', err);
});


bot.startPolling()