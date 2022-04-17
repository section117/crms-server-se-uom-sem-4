const userRepository = require('../repositories/userRepository');

const getUserByEmail = async (email) => {
	const user = await userRepository.getUserByEmail(email);
	return user;
};


const saveUser = async (user) => {


	return userRepository.saveUser(user);

};










exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;