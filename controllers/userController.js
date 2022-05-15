const passport = require('../config/passport-config');
const userService = require('../services/userService');

const sessionHelper = require('../helpers/session-helper');

const bcrypt = require('bcrypt');
const { exist } = require('joi');
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
		password: hashedPassword
	};
	
	const newCompany = {
		company_name:req.body.company_name,
		company_email:req.body.company_email,
		website:req.body.website,
		address:req.body.address
	};

	const company=await userService.saveCompany(newCompany);
	const owner=await userService.saveUser(newUser);

	if (owner && company) {
		console.log('registation successful');
		res.redirect('/');
		exist;
	} 
	res.redirect('/');




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


const viewProfile = async (req,res)=>{
	// const user_details = userService.getUserByID(req.session);
	// console.log(user_details);
	// res.send('Profile');
	const user = await userService.getUserByID(req.session.passport.user.id);
	res.render('user/profile.ejs',{user:user});

};


const updateUser = async (req,res)=>{

	const current_user =await userService.getUserByID(req.session.passport.user.id);

	const user_details = {
		email:req.body.email,
		first_name : req.body.first_name,
		last_name : req.body.last_name,
	};

	if (req.body.currentPassword && req.body.newPassword) {
		const result = await bcrypt.compare(req.body.currentPassword,current_user.password);
		if (result) {
			const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
			user_details.password = hashedPassword;
			console.log('Password match');
		}else{
			console.log('Password mismatch');
			return res.redirect('/profile');
		}	
	}
	
	await userService.updateUser(current_user._id,user_details);
	
	return res.redirect('/profile');
};

exports.handleLogin = login;
exports.handleRegistration = register;
exports.handleLogout = logout;
exports.getCurrentUser = getCurrentUser;
exports.userProfile = viewProfile;
exports.handleUpdate = updateUser;