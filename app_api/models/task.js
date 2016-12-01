var mongoose = require('mongoose')

var taskSchema = new mongoose.Schema({
	title:{type: String, required:true},
	description: String,
	creator: String,
	completed: Boolean
})

mongoose.model('Task', taskSchema)