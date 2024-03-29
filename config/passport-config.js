const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const userService = require('../services/userService');

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (username, password, done) => {
			const user = await userService.getUserByEmail(username);

			if (!user) return done(null, false, { message: 'EMAIL NOT FOUND' });

			bcrypt.compare(password, user.password, function (err, result) {
				if (result) {
					return done(null, user, 'SUCCESS');
				} else {
					console.log('wrong pass');
					return done(null, false, { message: 'WRONG PASSWORD' });
				}
			});
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, {
		id: user.id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		user_type: user.user_type,
		company_id: user.company._id,
	});
});
passport.deserializeUser(function (user, done) {
	done(null, user);
});

module.exports = passport;
