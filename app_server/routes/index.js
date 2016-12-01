var express = require('express');
// let ctrlGithub = require('../controllers/github')
let router = express.Router();

module.exports = (passport) => {

	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render('index', {title: 'Express', msg: 'Welcome to pomodoro schedule'});
	});

	router.post('/webhook', (req, res, next) => {
		console.log('> post to /webhook: ' + req)
	})

	router.get('/profile', isLoggedIn, (req, res, next) => {
		res.render('index', {
			title: 'Successful log in', 
			msg: 'Welcome ' + req.user
		});
	});

	router.get('/auth/github', passport.authenticate('github', { scope: ['repo', 'user']}))
	router.get('/auth/github/callback', passport.authenticate('github', {
		successRedirect: '/profile',
		failureRedirect:'/failure'
		
	}))

	router.get('/success', (req, res) => {
		res.render('index', {title: 'Success', msg: req.profile})
	})
	router.get('/failure', (req, res) => {
		res.render('index', {title: 'Failure', msg: 'What are you trying to do'})
	})

	function isLoggedIn(req, res, next) {
		// If successful authentication, pass NEXT request
		if(req.isAuthenticated()){
			console.log('> isLoggedIn')
			return next()
		}
		res.redirect('/')
	}
	return router
}