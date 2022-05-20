const { User } = require("../models/user");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Company } = require("../models/company");

let company_id = null;

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user ? user : null;
};

const saveUser = async (user) => {
  const newUser = new User({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    user_type: user.user_type,
    password: user.password,
    company: user.user_type == "COMPANY_OWNER" ? company_id : user.company,
  });

  const result = await newUser.save();
  return result;
  // await newUser.save((err) => {
  //   if (err) {
  //     console.log(err);
  //     return false;
  //   } else {
  //     console.log("User registration successful");
  //     return true;
  //   }
  // });
};

const saveCompany = async (company) => {
  const newCompany = new Company({
    company_name: company.company_name,
    company_email: company.company_email,
    website: company.website,
    address: company.address,
  });

  company_id = newCompany._id;
  console.log(company_id);

  newCompany.save((err) => {
    if (err) {
      console.log(err);

      return false;
    } else {
      console.log("company save successful");
      // res.redirect('dashboard');
      return true;
    }
  });
};

const getUserByID = async (user_id) => {
  const user = await User.findById(user_id).populate("company");
  return user ? user : null;
};

const toggleCSSAOnlineStatus = async (user_id, is_online) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: ObjectId(user_id) },
      { is_online },
      { new: true }
    );
    return user;
  } catch (e) {
    return null;
  }
};

const updateUser = async (user_id, user_details) => {
  return await User.findByIdAndUpdate(user_id, user_details);
};

const updateCompany = async (company_id, company_details) => {
  return await Company.findByIdAndUpdate(company_id, company_details);
};

const getCSSAList = async (company_id) => {
  return await User.find({ company: company_id, user_type: "CSSA" }).select({
    first_name: 1,
    last_name: 1,
    email: 1,
    _id: 1,
  });
};

const deleteUser = async (user_id) => {
  return await User.findByIdAndRemove(user_id);
};

exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;

exports.saveCompany = saveCompany;

exports.getUserByID = getUserByID;
exports.toggleCSSAOnlineStatus = toggleCSSAOnlineStatus;

exports.updateUser = updateUser;
exports.updateCompany = updateCompany;

exports.getCSSAList = getCSSAList;
exports.deleteUser = deleteUser;
