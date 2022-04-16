
const viewHome = (req, res) => {
	res.render('home/index.ejs');
};

const viewSignupPage = (req, res) => {
	res.render('home/register.ejs');
};

const viewDashboard = (req, res) => {
	res.render('home/dashboard.ejs');
};

module.exports = {
	viewHome,
	viewDashboard,
	viewSignupPage
};