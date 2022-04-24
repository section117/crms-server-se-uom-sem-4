const userRepository = require('../repositories/userRepository');

const getUserByEmail = async (email) => {
	const user = await userRepository.getUserByEmail(email);
	return user;
};


const saveUser = async (user) => {


	return userRepository.saveUser(user);

};

const saveCompany = async (company) => {


	return userRepository.saveCompany(company);

};











exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;
exports.saveCompany =saveCompany;