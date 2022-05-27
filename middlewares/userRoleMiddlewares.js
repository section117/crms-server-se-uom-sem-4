const { getUserTypeFromSession } = require('../helpers/session-helper');

const ensureUserRole = (req, res, next) => {
    
	if (getUserTypeFromSession(req.session) === 'COMPANY_OWNER') {
		return next();
	}
	res.redirect('/404');
};

exports.ensureUserRole = ensureUserRole;