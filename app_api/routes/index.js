var express = require('express')
var router = express.Router()
let ctrlTask = require('../controllers/tasks')

/* API task manager routes */
router.get('/tasks', ctrlTask.listTasks)
router.post('/task', ctrlTask.createTask)
router.get('/task/:taskid', ctrlTask.readTask)
router.put('/task/:taskid', ctrlTask.updateTask)
router.delete('/task/:taskid', ctrlTask.deleteTask)

module.exports = router;