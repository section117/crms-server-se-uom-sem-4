
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

exports.ensureAuthenticated = ensureAuthenticated;
exports.guestOnly = guestOnly;