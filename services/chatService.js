const chatRepository = require('../repositories/chatRepository');


const getActiveChatsOfCSSA = async (user_id) => {
	return await chatRepository.getChatsOfCSSA(user_id, 'Active');
};

exports.getActiveChatsOfCSSA = getActiveChatsOfCSSA;