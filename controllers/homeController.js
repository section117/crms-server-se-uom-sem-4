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

module.exports = {
  viewHome,
  viewDashboard,
  viewSignupPage,
};
