
const getUserFromSession = (session) => {
	if(session && session.passport && session.passport.user)
		return session.passport.user;
	else return null;
};

const getUserTypeFromSession = session => {
	if(session && session.passport && session.passport.user && session.passport.user.user_type)
		return session.passport.user.user_type;
	else return null;
};

const getUserIDFromSession = session => {
	if(session && session.passport && session.passport.user && session.passport.user.id)
		return session.passport.user.id;
	else return null;
};

const getCompanyIDFromSession = session => {
	if(session && session.passport && session.passport.user && session.passport.user.company_id)
		return session.passport.user.company_id;
	else return null;
};

exports.getUserFromSession = getUserFromSession;
exports.getUserTypeFromSession = getUserTypeFromSession;
exports.getUserIDFromSession = getUserIDFromSession;
exports.getCompanyIDFromSession = getCompanyIDFromSession;