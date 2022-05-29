
const renderOnlyForRole = (user, user_types) => {
	if (!user || !user.user_type) return false;
	return user_types.includes(user.user_type);
};

exports.renderOnlyForRole=renderOnlyForRole;