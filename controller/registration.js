const User = require("../models/user");
const Teacher = require("../models/teacher");
const Admin = require("../models/admin");
const Role = require("../models/role");
// Check username [By Sayani] [fixes all Errors]
exports.ValidateUserID = async (req, res) => {
    const { UserName } = req.body;
    try {
      const user = await User.findOne({ UserName });
      if (user) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking username:", error);
      return res.status(500).json({ error: "Server error" });
    }
  };

  // Check Email [By Chaitali] [fixes all Errors] [modified]
exports.ValidateEmail = async (req, res) => {
  const { Email } = req.body;
  try {
    const user = await User.findOne({ Email });
    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking Email:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

  // Check PhoneNumber [By Chaitali] [fixes all Errors] [modified]
  exports.ValidatePhone = async (req, res) => {
    const { PhoneNumber } = req.body;
    try {
      const user = await User.findOne({ PhoneNumber });
      if (user) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking PhoneNumber:", error);
      return res.status(500).json({ error: "Server error" });
    }
  };

//Show All Teachers From Teachers Collection [By Pritom] 

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

//Show All Admins From Admins Collection [By Pritom] 

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

//Show All Users  From Roles Collection [By Ishita] /* NEW */

exports.ValidateRoleTable = async (req, res) => {
  try {
    const user = await Role.find();
    if (user.length === 0) {
      return res.status(404).json({ message: 'No Users found' });
    } 
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Signup API [By Pritom]
exports.UserSignup = async (req, res) => {
  const newUser = new User(req.body);
  try {
    const find = await User.findOne({ UserName: req.body.UserName });
    if (find) {
      return res.status(400).json({ message: "User already registered" });
    }
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.TeacherRegCount=async(req,res)=>{
  const date = new Date();
    date.setDate(date.getDate() - 90);
  try {
      const count = await Teacher.countDocuments([
        { createdAt: { $gte: date } },
    { _id: '$role'} 
      ]);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};