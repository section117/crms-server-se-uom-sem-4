const passport = require('../config/passport-config');
const userService = require('../services/userService');

const sessionHelper = require('../helpers/session-helper');

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


	if (userService.saveUser(newUser)) {
		console.log('registation successful');
		res.redirect('/');
	} else {
		console.log('registation failed');
	}





};


const getCurrentUser = async (req, res) => {
	const user_id = sessionHelper.getUserIDFromSession(req.session);

	if (!user_id) {
		res.code(404);
		return;
	}

	const user = await userService.getUserByID(user_id);
	if(!user) res.code(404);

	user['password'] = null;
	if(!user['is_online']) user['is_online'] = false;

	res.json(user);
};

exports.handleLogin = login;
exports.handleRegistration = register;
exports.handleLogout = logout;
exports.getCurrentUser = getCurrentUser;