let mongoose = require('mongoose')
let Tasks = mongoose.model('Tasks')

module.exports.listTasks = (req, res) => {
	Tasks
		.find()
		.exec( (err, tasks) => {
			if(err) 
				sendJSONresponse(res, 400, err)
			else{
				tasks.forEach( (task) => {
					console.log(task)
				})
				sendJSONresponse(res, 200, tasks)
			}
		})
}

module.exports.createTask = (req, res) => {
	task = {
		title: req.body.title,
		description: req.body.description
	}
	Tasks
		.create(task)
		.then( (task) => {
			sendJSONresponse(res, 201, task)
		})
}

module.exports.readTask = (req, res) => {
	Tasks
		.findById(req.params.taskid)
		.exec( (err, task) => {
			if(err) 
				sendJSONresponse(res, 400, err)
			else
				sendJSONresponse(res, 200, task)
		})
}

module.exports.updateTask = (req, res) => {
	Tasks
		.findById(req.params.taskid)
		.exec( (err, task) => {
			if(!task){
				sendJSONresponse(res, 404, {message: 'Task not found'})
				return;
			}
			if(err){
				sendJSONresponse(res, 400, err)
				return;
			}

			task.title = req.body.title;
			task.description = req.body.description;
			task
				.save()
				.then( (task) => {
					sendJSONresponse(res, 200, task)
				})
		})
}

module.exports.deleteTask = (req, res) => {
	Tasks
		.findByIdAndRemove(req.params.taskid)
		.exec( (err, task) => {
			if(err){
				sendJSONresponse(res, 404, err)
				return;
			}
			sendJSONresponse(res, 203, task)
		})
}

let sendJSONresponse = (res, status, content) => {
	res.status(status)
	res.json(content)
}