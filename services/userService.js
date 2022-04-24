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



const getUserByID = async (user_id) => {
	return await userRepository.getUserByID(user_id);
};

const toggleCSSAOnlineStatus = async (user_id, is_online) => {
	return await userRepository.toggleCSSAOnlineStatus(user_id, is_online);
};






exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;

exports.saveCompany =saveCompany;

exports.getUserByID = getUserByID;
exports.toggleCSSAOnlineStatus = toggleCSSAOnlineStatus;

