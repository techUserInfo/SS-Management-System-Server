const mongoose = require("mongoose");

// SuperAdmin schema
const superAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
