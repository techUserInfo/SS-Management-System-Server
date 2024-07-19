const mongoose = require("mongoose");

// Student schema
const studentSchema = new mongoose.Schema({
  UserName: { type: String, required: true },
  LastName: { type: String },
  ParentName: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  Email: { type: String },
  Class: { type: String, required: true },
  Section: { type: String, required: true },
  SPOC: { type: String, default: null },
}, { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
