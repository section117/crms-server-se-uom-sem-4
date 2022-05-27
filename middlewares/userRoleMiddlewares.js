const { getUserTypeFromSession } = require('../helpers/session-helper');

const allowByUserTypes = (user_types) => {
	return (req, res, next) => {
		const user_type = getUserTypeFromSession(req.session);
		if(user_types.includes(user_type)) {
			next();
		} else {
			res.redirect('/404');
		}
	};
};

exports.allowByUserTypes = allowByUserTypes;