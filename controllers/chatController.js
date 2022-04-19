

const viewAllChats = (req, res) => {
	res.render('chats/all-chats.ejs');
};

const viewChat = (req, res) => {
	// console.log(req.session.passport.user.id);
	// console.log('welcome '+req.session.passport.user.first_name);
	res.render('chat/chat.ejs');
};

exports.viewAllChats = viewAllChats;
exports.viewChat = viewChat;

