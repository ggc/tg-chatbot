var mongoose = require('mongoose')

var taskSchema = new mongoose.Schema({
	title:{type: String, required:true},
	description: String
})

mongoose.model('Tasks', taskSchema)