const mongoose = require("mongoose");

// Role schema
const roleSchema = new mongoose.Schema({
  UserName: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  Email: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
});

module.exports = mongoose.model("Role", roleSchema);
