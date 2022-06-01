const passport = require('../config/passport-config');
const userService = require('../services/userService');

const sessionHelper = require('../helpers/session-helper');

const bcrypt = require('bcrypt');
const { exist } = require('joi');
const { companyValidateSchema, userRegistrationSchema, userUpdateSchema } = require('../helpers/validate-schema');


const saltRounds = 10;

const login = passport.authenticate('local', {
	successRedirect: '/dashboard',
	failureRedirect: '/',
	failureMessage: true,
});

const logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

const register = async (req, res) => {
	//with bcrypt
	const hashedPassword =
    req.body.password.trim() !== '' ? await bcrypt.hash(req.body.password, saltRounds):'';

	const newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		user_type: req.body.user_type,
		password: hashedPassword,
	};
  
	console.log(newUser);

	const { error, value } = userRegistrationSchema.validate(newUser, {
		abortEarly: false,
	});
	if (error){
		if (newUser.user_type === 'COMPANY_OWNER') {
			req.flash('message',error.details[0].message);
			return res.redirect('/register');
		}
		req.flash('error',error.details[0].message);
		// console.log(req.flash('err'));
		return res.redirect('/manage-cssa');
	}

	const checkUser = await userService.getUserByEmail(newUser.email);

	if (checkUser){
		req.flash('message','Email already registered');
		if (newUser.user_type === 'COMPANY_OWNER') {
			return res.redirect('/register');
		}
		req.flash('error','Email already registered');
		return res.redirect('/manage-cssa');
	}

	if (newUser.user_type === 'COMPANY_OWNER') {

		const newCompany = {
			company_name: req.body.company_name,
			company_email: req.body.company_email,
			website: req.body.website,
			address: req.body.address,
		};
		const { error, value } = companyValidateSchema.validate(newCompany, {
			abortEarly: false,
		});

		if (error){
			req.flash('message',error.details[0].message);
			return res.redirect('/register');
		}

		const company = await userService.saveCompany(newCompany);
		const owner = await userService.saveUser(newUser);

		if (owner && company) {
			console.log('registration successful');
			res.redirect('/dashboard');

			exist;
		}
	} else {
		newUser.company = sessionHelper.getCompanyIDFromSession(req.session);
		const cssa = await userService.saveUser(newUser);
		console.log(cssa);
		if (cssa) {
			console.log('registration successful');
			req.flash('success','CSSA registered successfully');

			return res.redirect('/manage-cssa');
		}
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
	if (!user) res.code(404);

	user['password'] = null;
	if (!user['is_online']) user['is_online'] = false;

	res.json(user);
};

const viewProfile = async (req, res) => {
	const user = await userService.getUserByID(sessionHelper.getUserIDFromSession(req.session));
	// console.log(req.flash('message') == '',new Date());
	res.render('user/profile.ejs', { user: user ,message:{err:req.flash('error'),success:req.flash('success')}});

};

const updateUser = async (req, res) => {
	const current_user = await userService.getUserByID(
		sessionHelper.getUserFromSession
	);
	// const current_password = await bcrypt.hash(req.body.currentPassword, saltRounds);


	const user_details = {
		email: req.body.email,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
	};
  
	// console.log(user_details);
	const { error, value } = userUpdateSchema.validate(user_details, {
		abortEarly: false,
	});
	if (error){
		// console.log(req.flash());
		req.flash('error','Failed to update : '+error.details[0].message);
		return res.redirect('/profile');
	}


	if (req.body.currentPassword && req.body.newPassword) {
		const result = await bcrypt.compare(
			req.body.currentPassword,
			current_user.password
		);
		if (result) {

			const hashedPassword = await bcrypt.hash(
				req.body.newPassword,
				saltRounds
			);
			user_details.password = hashedPassword;
			// console.log('Password match');
		} else {
			req.flash('error','Failed to update : Current password is wrong');
			return res.redirect('/profile');
		}
	}else if(req.body.currentPassword || req.body.newPassword){
		req.flash('error','Please provide both current and new passwords to update the password');
		return res.redirect('/profile');
	}
	
	await userService.updateUser(current_user._id, user_details);

	if (current_user.user_type === 'COMPANY_OWNER') {

		const company_id = current_user.company._id;

		const company_details = {
			company_name: req.body.company_name,
			company_email: req.body.company_email,
			website: req.body.website,
			address: req.body.address,
		};
		const { error, value } = companyValidateSchema.validate(company_details, {
			abortEarly: false,
		});

		if (error){
			console.log(req.flash());
			req.flash('error','Failed to update : '+error.details[0].message);
			return res.redirect('/profile');
		}
		const updated = await userService.updateCompany(company_id, company_details);
		if (updated) {
			req.flash('success','Updated successfully!');
			return res.redirect('/profile');
		}

	}

	return res.redirect('/profile');
};

const viewCSSAList = async (req, res) => {
	const cssa_list = await userService.getCSSAList(
		sessionHelper.getCompanyIDFromSession(req.session)
	);

	// console.log(req.flash('message'),'123');
	res.render('user/CSSA.ejs', { cssa_list: cssa_list,message:{err:req.flash('error'),success:req.flash('success')} });

};

const deleteUser = async (req, res) => {
	// console.log(req.body);
	await userService.deleteUser(req.body.cssa_id);
	
	res.redirect('/manage-cssa');
};

exports.handleLogin = login;
exports.handleRegistration = register;
exports.handleLogout = logout;
exports.getCurrentUser = getCurrentUser;
exports.userProfile = viewProfile;
exports.handleUpdate = updateUser;
exports.viewCSSAList = viewCSSAList;
exports.handleDelete = deleteUser;
