const chatService = require('../services/chatService');
const userService = require('../repositories/userRepository');

const sessionHelper = require('../helpers/session-helper');

const viewHome = (req, res) => {
	res.render('home/index.ejs');
};

const viewSignupPage = (req, res) => {
	const message = req.flash('message');
	res.render('home/register.ejs',{message});
};

const viewDashboard = async (req, res) => {
	const userID = sessionHelper.getUserIDFromSession(req.session);
	const userType = sessionHelper.getUserTypeFromSession(req.session);

	if(userType === 'CSSA') {
		const activeChats = await chatService.getActiveChatsOfCSSAWithMessages(userID);
		const closedChats = await chatService.getCloseChatsOfCSSAWithMessages(userID);
		const positiveFeedback = await chatService.getPositiveFeedback(userID);
		const negativeFeedback = await chatService.getNegativeFeedback(userID);
		const resolevedFeedback = await chatService.getResolvedFeedbackForCSSA(userID);
		res.render('home/dashboard.ejs', {
			user: sessionHelper.getUserFromSession(req.session),
			activeChats: activeChats.length,
			closedChats: closedChats.length,
			positiveFeedback: positiveFeedback.length,
			negativeFeedback: negativeFeedback.length,
			resolvedFeedback: resolevedFeedback.length
		});
	}else if(userType === 'COMPANY_OWNER') {
		const companyID = sessionHelper.getCompanyIDFromSession(req.session);
		const allChats = await chatService.getAllChatDetails(companyID);
		const currentMonthChats = await chatService.getCurrentMonthChats(companyID);
		const currentMontPositiveFeedback = await chatService.getCurrentMonthPositiveFeedback(companyID);
		const currentMonthNegativeFeedback = await chatService.getCurrentMonthNegativeFeedback(companyID);
		const cssaList = await userService.getCSSAList(companyID);
		const positiveFeedback = await chatService.getPositiveFeedbackForCompany(companyID);
		const negativeFeedback = await chatService.getNegativeFeedbackForCompany(companyID);
		const resolvedFeedback = await chatService.getResolvedFeedbackForCompany(companyID);
		res.render('home/dashboard.ejs', {
			user: sessionHelper.getUserFromSession(req.session),
			allChats: allChats.length,
			currentMonthChats: currentMonthChats.length,
			currentMontPositiveFeedback: currentMontPositiveFeedback.length,
			currentMonthNegativeFeedback: currentMonthNegativeFeedback.length,
			numberOfCSSA: cssaList.length,
			positiveFeedback: positiveFeedback.length,
			negativeFeedback: negativeFeedback.length,
			resolvedFeedback: resolvedFeedback.length
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
