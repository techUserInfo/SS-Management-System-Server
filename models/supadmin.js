const mongoose = require("mongoose");

// SuperAdmin schema
const superAdminSchema = new mongoose.Schema({
  UserName: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  Email: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
