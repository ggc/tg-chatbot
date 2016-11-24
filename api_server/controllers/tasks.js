let mongoose = require('mongoose')
let Tasks = mongoose.model('Tasks')

module.exports.listTasks = (req, res) => {
	Tasks
		.find()
		.exec( (err, tasks) => {
			if(err) return handleError(err)
			tasks.forEach( (task) => {
				console.log(task)
			})
			sendJSONresponse(res, 200, tasks)
		})
}

module.exports.readOneTask = (req, res) => {
	Tasks
		.findById("58342b64ab6eb4183a8b112d")
		.exec( (err, task) => {
			if(err) return handleError(err)
			sendJSONresponse(res, 200, task)
		})
}

module.exports.createTask = (req, res) => {
	task = {
		title: req.body.title,
		description: req.body.description
	}
	Tasks
		.create(task)
		.exec( (err, task) => {
			if(err)
				sendJSONresponse(res, 400, err)
			else
				sendJSONresponse(res, 201, task)
		})
}

let sendJSONresponse = (res, status, content) => {
	res.status(status)
	res.json(content)
}