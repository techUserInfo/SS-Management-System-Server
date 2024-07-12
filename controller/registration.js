const User = require("../models/user");
const Teacher = require("../models/teacher");
const Admin = require("../models/admin");



// Check email and phone number [By Chaitali] [fixes all Errors]
exports.ValidatePhone = async (req, res) => {
  const { PhoneNumber } = req.body;
  try {
    const user = await User.findOne({ PhoneNumber: PhoneNumber });
    res.status(200).json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check email and phone number [By Chaitali] [fixes all Errors]
exports.ValidateEmail = async (req, res) => {
  const { Email } = req.body;
  try {
    const user = await User.findOne({ Email: Email });
    res.status(200).json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check username [By Sayani] [fixes all Errors]
exports.ValidateUserID = async (req, res) => {
  const { UserName } = req.body;
  try {
    const user = await User.findOne({ UserName: UserName });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//Show All Teachers From Teachers Collection [By Pritom] /* NEW */

exports.ValidateTeacher = async (req, res) => {
  try {
    const user = await Teacher.find();
    if (user.length === 0) {
      return res.status(404).json({ message: 'No teachers found' });
    } 
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Show All Admins From Admins Collection [By Pritom] /* NEW */

exports.ValidateAdmin = async (req, res) => {
  try {
    const user = await Admin.find();
    if (user.length === 0) {
      return res.status(404).json({ message: 'No Admins found' });
    } 
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};