const viewHome = (req, res) => {
  res.render("home/index.ejs");
};

const viewSignupPage = (req, res) => {
  res.render("home/register.ejs");
};

const viewDashboard = (req, res) => {
  // console.log(req.session.passport.user.id);
  console.log("welcome " + req.session.passport.user.first_name);
  res.render("home/dashboard.ejs", { user: req.session.passport.user });
};

const viewChatIntegration = (req, res) => {
	res.render('home/integration.ejs');
};

const render404 = (req, res) => {
	res.render('errors/404.ejs');
};

module.exports = {
	viewHome,
	viewDashboard,
	viewSignupPage,
	viewChatIntegration,
	render404
};
