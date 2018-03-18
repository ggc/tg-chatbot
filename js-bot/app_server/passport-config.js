let githubStrategy = require('passport-github').Strategy

module.exports = (passport) => {

	passport.use(
		new githubStrategy({
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: 'http://127.0.0.1:5000/auth/github/callback'
		},
		(accessToken, refreshToken, profile, cb) => {
			return cb(null, profile)
		}
	))

	passport.serializeUser( (user, cb) => {
		cb(null, user)
	})
	passport.deserializeUser( (obj, cb) => {
		cb(null, obj)
	})

}