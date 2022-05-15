
const { User } = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { Company} = require('../models/company');

let company_id = null;

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
		password: user.password,
		company : company_id
	});

	

	newUser.save((err) => {
		if (err) {
			console.log(err);
			
			return false;
			
		} else {
			console.log('owner save successful');
			// res.redirect('dashboard');
			return true;
		}
	});

};


const saveCompany = async (company) => {

	const newCompany = new Company({
		company_name:company.company_name,
		company_email:company.company_email,
		website:company.website,
		address:company.address,
	});

	company_id = newCompany._id;
	console.log(company_id);

	newCompany.save((err) => {
		if (err) {
			console.log(err);
			
			return false;
			
		} else {
			console.log('company save successful');
			// res.redirect('dashboard');
			return true;
		}
	});

};

const getUserByID = async (user_id) => {
	const user = await User.findById(user_id).populate('company');
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

const updateUser = async (user_id,user_details)=>{
	return await User.findByIdAndUpdate(user_id,user_details);
};




exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;

exports.saveCompany =saveCompany;

exports.getUserByID = getUserByID;
exports.toggleCSSAOnlineStatus = toggleCSSAOnlineStatus;

exports.updateUser = updateUser;