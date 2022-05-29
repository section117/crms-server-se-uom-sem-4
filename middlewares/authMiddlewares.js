const { getUserFromSession } = require('../helpers/session-helper');
const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
};

const guestOnly = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/dashboard');
};

const storeSessionToLocals = (req, res, next) => {
	res.locals.user = getUserFromSession(req.session);
	next();
};

exports.ensureAuthenticated = ensureAuthenticated;
exports.guestOnly = guestOnly;
exports.storeSessionToLocals = storeSessionToLocals;