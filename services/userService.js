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






exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;
exports.getUserByID = getUserByID;