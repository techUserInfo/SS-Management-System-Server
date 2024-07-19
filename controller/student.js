const Student = require("../models/student.js");

// Student signup [By Shreya] [fixes all Errors]
exports.StudentSignup = async (req, res) => {
  const newStudent = new Student(req.body);
  try {
    const find = await Student.findOne({ UserName: req.body.UserName });
    if (find) {
      return res.status(400).json({ message: "Student already registered" });
    }
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


//Show All Students From Students Collection [By Ishita] /* NEW */

exports.ValidateStudent = async (req, res) => {
  try {
    const user = await Student.find();
    if (user.length === 0) {
      return res.status(404).json({ message: 'No Students found' });
    } 
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.StudentRegCount=async(req,res)=>{
  const date = new Date();
    date.setDate(date.getDate() - 90);
  try {
      const count = await Student.countDocuments([
        { createdAt: { $gte: date } },
    { _id: '$role'} 
      ]);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};