const userRepository = require('../repositories/userRepository');

const getUserByEmail = async (email) => {
	return await userRepository.getUserByEmail(email);
};

const saveUser = async (user) => {
	return await userRepository.saveUser(user);
};

const saveCompany = async (company) => {
	return await userRepository.saveCompany(company);
};

const getUserByID = async (user_id) => {
	return await userRepository.getUserByID(user_id);
};

const toggleCSSAOnlineStatus = async (user_id, is_online) => {
	return await userRepository.toggleCSSAOnlineStatus(user_id, is_online);
};

const updateUser = async (user_id, user_details) => {
	return await userRepository.updateUser(user_id, user_details);
};

const updateCompany = async (user_id, company_details) => {
	return await userRepository.updateCompany(user_id, company_details);
};

const getCSSAList = async (company_id) => {
	return await userRepository.getCSSAList(company_id);
};

const deleteUser = async (user_id) => {
	return await userRepository.deleteUser(user_id);
};

exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;

exports.saveCompany = saveCompany;

exports.getUserByID = getUserByID;
exports.toggleCSSAOnlineStatus = toggleCSSAOnlineStatus;

exports.updateUser = updateUser;
exports.updateCompany = updateCompany;

exports.getCSSAList = getCSSAList;
exports.deleteUser = deleteUser;
