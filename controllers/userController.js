const passport = require('../config/passport-config');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
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
const register = (req, res) => {



	//with bcrypt
	bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
		const newUser = new User({

			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			user_type: req.body.user_type,
			// company: req.body.company,
			password: hash
		});

		console.log(newUser.first_name)

		newUser.save((err) => {
			if (err) {
				console.log(err);
			} else {
				console.log("registation successful");
				res.redirect("dashboard");
			}
		})
	});




}


exports.handleLogin = login;
exports.handleRegistration = register;
exports.handleLogout = logout;