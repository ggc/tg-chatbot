var githubStrategy = require('passport-github').Strategy
let mongoose = require('mongoose')
var Users = mongoose.model('User')

module.exports = (passport) => {

	passport.serializeUser( (user, done) => {
		done(null, user.id)
	})
	passport.deserializeUser( (id, done) => {
		Users.findById(id, (err, user) => {
			done(err, user)	
		})
	})

	passport.use(
		new githubStrategy({
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: 'http://127.0.0.1:5000/auth/github/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			console.log('> accessToken: ', accessToken)
			// nextTick() force synchrony 
			process.nextTick(() => {
				Users.findOne({ id: profile.id }, (err, user) => {
					if (err) 
						return done(err)
					if (user)
						return done(null, user)
					else{
						let newUser = Users()
						newUser.id = profile.id
						newUser.token = accessToken
						newUser.email = profile.emails
						newUser.fullName = profile.displayName

						newUser.save( (err) => {
							if(err)
								throw err
							return done(null, newUser)
						})
					}

				})
			})
		}
	))
}