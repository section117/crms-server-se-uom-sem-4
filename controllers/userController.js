const passport = require('../config/passport-config');
const userService = require('../services/userService');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const login = passport.authenticate('local', {
	successRedirect: '/dashboard',
	failureRedirect: '/',
	failureMessage: true
});

const logout = (req, res) => {
	req.logout();
	res.redirect('/');
};


//temporarily removed the company name
const register = async (req, res) => {



	//with bcrypt
	const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

	const newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		user_type: req.body.user_type,
		// company: req.body.company,
		password: hashedPassword
	};
	console.log(req.body.user_type);

	const confirm=await userService.saveUser(newUser);

	if (confirm) {
		console.log('registation successful');
		res.redirect('/');
	} else {
		console.log('registation failed');
	}





};


exports.handleLogin = login;
exports.handleRegistration = register;
exports.handleLogout = logout;