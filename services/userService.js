const userRepository = require('../repositories/userRepository');

const getUserByEmail = async (email) => {
	const user = await userRepository.getUserByEmail(email);
	return user;
};

exports.getUserByEmail = getUserByEmail;