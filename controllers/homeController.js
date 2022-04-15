
const viewHome = (req, res) => {
	res.render('home/index.ejs');
};

const viewDashboard = (req, res) => {
	res.render('home/dashboard.ejs');
};

module.exports = {
	viewHome,
	viewDashboard,
};