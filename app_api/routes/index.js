var express = require('express')
var router = express.Router()
let ctrlTask = require('../controllers/tasks')
let ctrlGithub = require('../controllers/github')

/* API task manager routes */
router.get('/tasks', ctrlTask.listTasks)
router.post('/task', ctrlTask.createTask)
router.get('/task/:taskid', ctrlTask.readTask)
router.put('/task/:taskid', ctrlTask.updateTask)
router.delete('/task/:taskid', ctrlTask.deleteTask)

/* API issue manager routes */
router.get('/issues', ctrlGithub.listIssues)

module.exports = router;