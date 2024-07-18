const mongoose = require("mongoose");

// Teacher schema
const teacherSchema = new mongoose.Schema(
  {
    UserName: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    Email: { type: String, required: true },
    PhoneNumber: { type: String, required: true },
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);