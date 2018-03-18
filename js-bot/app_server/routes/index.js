var express = require('express');
// let ctrlGithub = require('../controllers/github')
let router = express.Router();

module.exports = (passport) => {

	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render('index', {title: 'Pomodoritbot', msg: 'Welcome to pomodoro schedule'});
	});

	router.post('/webhook', (req, res, next) => {
		console.log('> post to /webhook: ' + req)
	})

	router.get('/auth/github', passport.authenticate('github'))
	router.get('/auth/github/callback', passport.authenticate('github', {
		failureRedirect:'/failure',
		successRedirect: '/success'
	}))

	router.get('/success', (req, res) => {
		res.render('index', {title: 'Success', msg: req.profile})
	})
	router.get('/failure', (req, res) => {
		res.render('index', {title: 'Failure', msg: 'What are you trying to do'})
	})

	return router
}