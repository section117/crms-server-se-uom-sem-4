const passport = require('../config/passport-config');
const userService = require('../services/userService');

const sessionHelper = require('../helpers/session-helper');

const bcrypt = require('bcrypt');
const { exist } = require('joi');
const {
	userValidateSchema,
	companyValidateSchema,
} = require('../helpers/validate-schema');
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
    req.body.password.trim() !== '' ? await bcrypt.hash(req.body.password, saltRounds) : '';
	console.log(req.body.password === '');
	const newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		user_type: req.body.user_type,
		password: hashedPassword,
	};

	const { error, value } = userValidateSchema.validate(newUser, {
		abortEarly: false,
	});
	if (error)
		return res
			.status(400)
			.json({ status: 'Failed', data: error.details[0].message });

	const checkUser = await userService.getUserByEmail(newUser.email);

	if (checkUser) {
		return res
			.status(409)
			.json({ status: 'Failed', data: 'Email already exists !' });
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
		if (error)
			return res
				.status(400)
				.json({ status: 'Failed', data: error.details[0].message });

		const company = await userService.saveCompany(newCompany);
		const owner = await userService.saveUser(newUser);

		if (owner && company) {
			console.log('registation successful');
			res.redirect('/');
			exist;
		}
	} else {
		newUser.company = req.session.passport.user.company;
		const cssa = await userService.saveUser(newUser);
		console.log(cssa);
		if (cssa) {
			console.log('registation successful');
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
	// const user_details = userService.getUserByID(req.session);
	// console.log(user_details);
	// res.send('Profile');
	const user = await userService.getUserByID(req.session.passport.user.id);
	res.render('user/profile.ejs', { user: user });
};

const updateUser = async (req, res) => {
	const current_user = await userService.getUserByID(
		req.session.passport.user.id
	);

	const user_details = {
		email: req.body.email,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
	};

	const { error, value } = userValidateSchema.validate(user_details, {
		abortEarly: false,
	});
	if (error)
		return res
			.status(400)
			.json({ status: 'Failed', data: error.details[0].message });

	if (req.body.currentPassword && req.body.newPassword) {
		const result = await bcrypt.compare(
			req.body.currentPassword,
			current_user.password
		);
		if (result) {
			user_details.password = await bcrypt.hash(
				req.body.newPassword,
				saltRounds
			);
			console.log('Password match');
		} else {
			return res
				.status(401)
				.json({ status: 'Failed', data: 'Current password is wrong' });
		}
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

		await userService.updateCompany(company_id, company_details);
	}

	return res.redirect('/profile');
};

const viewCSSAList = async (req, res) => {
	const cssa_list = await userService.getCSSAList(
		req.session.passport.user.company
	);
	//  console.log(cssa_list[0]._id);
	res.render('user/CSSA.ejs', { cssa_list: cssa_list });
};

const deleteUser = async (req, res) => {
	// console.log(req.body);
	const result = userService.deleteUser(req.body.cssa_id);
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
