const { User } = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getUserByEmail = async (email) => {
	const user = await User.findOne({ email: email });
	return user ? user : null;
};

const saveUser = async (user) => {

	const newUser = new User({

		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		user_type: user.user_type,
		// company: req.body.company,
		password: user.password
	});

	console.log(newUser.first_name);

	newUser.save((err) => {
		if (err) {
			console.log(err);
			return false;
		} else {
			console.log('save successful');
			// res.redirect('dashboard');
			return true;
		}
	});

};

const getUserByID = async (user_id) => {
	const user = await User.findById(user_id);
	return user ? user : null;
};

const toggleCSSAOnlineStatus = async (user_id, is_online) => {
	try {
		const user = await User.findOneAndUpdate({_id: ObjectId(user_id)}, {is_online}, {new: true});
		return user;
	} catch (e){
		return null;
	}

};


exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;
exports.getUserByID = getUserByID;
exports.toggleCSSAOnlineStatus = toggleCSSAOnlineStatus;