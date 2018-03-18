var mongoose = require('mongoose')
let dbURI = 'mongodb://localhost/pomodoro'

if(process.env.NODE_ENV === 'production')
	dbURI = process.env.dbURI

mongoose.connect(dbURI)

mongoose.connection.on('connected', () => console.log('Mongoose connected to ', dbURI))
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected from ', dbURI))
mongoose.connection.on('error', (error) => console.log('Mongoose had an error: ', error))

// For nodemon restarts
process.once('SIGUSR2', function() {
	gracefulShutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});
// For app termination
process.on('SIGINT', function() {
	gracefulShutdown('app termination', function(){
		process.exit(0);
	});
});

var gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};


require('./tasks');