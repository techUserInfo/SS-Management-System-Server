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
