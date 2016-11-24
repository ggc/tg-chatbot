var express = require('express')
var router = express.Router()
let ctrlTask = require('../controllers/tasks')

/* GET home page. */
router.get('/tasks', ctrlTask.listTasks)
router.post('/task', ctrlTask.createTask)

module.exports = router;