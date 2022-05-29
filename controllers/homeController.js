const chatService = require('../services/chatService');
const userService = require('../repositories/userRepository');

const viewHome = (req, res) => {
	res.render('home/index.ejs');
};

const viewSignupPage = (req, res) => {
	const message = req.flash('message');
	res.render('home/register.ejs',{message});
};

const viewDashboard = async (req, res) => {
	const userID = req.session.passport.user.id;
	const userType = req.session.passport.user.user_type;

	if(userType === 'CSSA') {
		const activeChats = await chatService.getActiveChatsOfCSSAWithMessages(userID);
		const closedChats = await chatService.getCloseChatsOfCSSAWithMessages(userID);
		const positiveFeedback = await chatService.getPositiveFeedback(userID);
		const negativeFeedback = await chatService.getNegativeFeedback(userID);
		res.render('home/dashboard.ejs', {
			user: req.session.passport.user,
			activeChats: activeChats.length,
			closedChats: closedChats.length,
			positiveFeedback: positiveFeedback.length,
			negativeFeedback: negativeFeedback.length
		});
	}else if(userType === 'COMPANY_OWNER') {
		const companyID = req.session.passport.user.company;
		const allChats = await chatService.getAllChats(companyID);
		const currentMonthChats = await chatService.getCurrentMonthChats(companyID);
		const currentMontPositiveFeedback = await chatService.getCurrentMonthPositiveFeedback(companyID);
		const currentMonthNegativeFeedback = await chatService.getCurrentMonthNegativeFeedback(companyID);
		const cssaList = await userService.getCSSAList(companyID);
		const positiveFeedback = await chatService.getPositiveFeedbackForCompany(companyID);
		const negativeFeedback = await chatService.getNegativeFeedbackForCompany(companyID);
		console.log(positiveFeedback, '---------------------------------------------');
		res.render('home/dashboard.ejs', {
			user: req.session.passport.user,
			allChats: allChats.length,
			currentMonthChats: currentMonthChats.length,
			currentMontPositiveFeedback: currentMontPositiveFeedback.length,
			currentMonthNegativeFeedback: currentMonthNegativeFeedback.length,
			numberOfCSSA: cssaList.length,
			positiveFeedback: positiveFeedback.length,
			negativeFeedback: negativeFeedback.length
		});
	}
};

const viewChatIntegration = (req, res) => {
	res.render('home/integration.ejs');
};

const render404 = (req, res) => {
	res.render('errors/404.ejs');
};

module.exports = {
	viewHome,
	viewDashboard,
	viewSignupPage,
	viewChatIntegration,
	render404
};
