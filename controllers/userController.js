const login = async (req, res) => {
	console.log(req.body);
	res.send('Login');
};

exports.handleLogin = login;