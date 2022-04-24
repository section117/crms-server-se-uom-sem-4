const userRepository = require('../repositories/userRepository');

const getUserByEmail = async (email) => {
	const user = await userRepository.getUserByEmail(email);
	return user;
};


const saveUser = async (user) => {
	return userRepository.saveUser(user);
};


const getUserByID = async (user_id) => {
	return await userRepository.getUserByID(user_id);
};

const toggleCSSAOnlineStatus = async (user_id, is_online) => {
	return await userRepository.toggleCSSAOnlineStatus(user_id, is_online);
};






exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;
exports.getUserByID = getUserByID;
exports.toggleCSSAOnlineStatus = toggleCSSAOnlineStatus;