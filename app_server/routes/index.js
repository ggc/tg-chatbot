var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.post('/webhook', (req, res, next) => {
	console.log('> post to /webhook: ' + req)
})
module.exports = router;