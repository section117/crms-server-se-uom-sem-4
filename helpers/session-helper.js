
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

exports.getUserFromSession = getUserFromSession;
exports.getUserTypeFromSession = getUserTypeFromSession;