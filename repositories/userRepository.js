const { resolveInclude } = require('ejs');
const { User } = require('../models/user');

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




exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;