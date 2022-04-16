const passport  = require('../config/passport-config');

const login = passport.authenticate('local', {
	successRedirect: '/dashboard',
	failureRedirect: '/l',
	failureMessage: true
});

const logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

exports.handleLogin = login;
exports.handleLogout = logout;