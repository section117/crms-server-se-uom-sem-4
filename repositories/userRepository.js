// const { resolveInclude } = require('ejs');
const { User} = require('../models/user');
const { Company} = require('../models/company');

let userid=0;

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

	userid=newUser.id;
	// console.log(newUser.id);

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
		owner:userid
		
	});

	// console.log(newUser.first_name);

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







exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;
exports.saveCompany =saveCompany;