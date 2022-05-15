const ensureUserRole = (req, res, next) => {
  if (req.session.passport.user.user_type == "COMPANY_OWNER") {
    return next();
  }
  res.redirect("/");
};

exports.ensureUserRole = ensureUserRole;