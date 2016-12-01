var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	id: String,
	token: String,
	email: String,
	fullName: String
})

mongoose.model('User', userSchema)