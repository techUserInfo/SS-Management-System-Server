const User = require("../models/user");

// Login API [By Pritom]
exports.UserLogin = async (req, res) => {
  const { UserName, Password } = req.body;
  try {
    const user = await User.findOne({ UserName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.Password !== Password) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login API [By Pritom]
exports.Test = async (req, res) => {
  res.status(200).json({ message: "Connected Succesfully" });
};




