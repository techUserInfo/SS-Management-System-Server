const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/usermain");

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

// Role schema
const roleSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
});

// Admin schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
});

// SuperAdmin schema
const superAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
});

// Models
const User = mongoose.model("User", userSchema);
const Role = mongoose.model("Role", roleSchema);
const Admin = mongoose.model("Admin", adminSchema);
const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

// Assign role route
app.post("/assignrole", async (req, res) => {
  const { username, role } = req.body;

  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the role is valid
  if (!["admin", "teacher", "student", "superadmin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Check if the role is already assigned
  const existingRole = await Role.findOne({ username });
  if (existingRole) {
    return res.status(400).json({ message: "Role already assigned" });
  }

  // Assign role
  const newRole = new Role({
    username,
    role,
    email: user.email,
    phone_number: user.phone_number,
  });
  await newRole.save();

  // If the role is admin, add to admins table
  if (role === "admin") {
    const newAdmin = new Admin({
      username,
      role,
      email: user.email,
      phone_number: user.phone_number,
    });
    await newAdmin.save();
  }

  // If the role is superadmin, add to superadmins table
  if (role === "superadmin") {
    const newSuperAdmin = new SuperAdmin({
      username,
      role,
      email: user.email,
      phone_number: user.phone_number,
    });
    await newSuperAdmin.save();
  }

  res.status(200).json({ message: "Role assigned successfully" });
});

// Update role route
app.patch("/updaterole", async (req, res) => {
  const { username, role } = req.body;

  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the role is valid
  if (!["admin", "teacher", "student", "superadmin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Check if the user has an existing role
  const existingRole = await Role.findOne({ username });
  if (!existingRole) {
    return res.status(404).json({ message: "Role not assigned yet" });
  }

  // Updating admin table
  if (existingRole.role === "admin" && role !== "admin") {
    await Admin.findOneAndDelete({ username });
  } else if (role === "admin" && existingRole.role !== "admin") {
    const newAdmin = new Admin({
      username,
      role,
      email: user.email,
      phone_number: user.phone_number,
    });
    await newAdmin.save();
  }
  // Updating superadmin table
  if (existingRole.role === "superadmin" && role !== "superadmin") {
    await SuperAdmin.findOneAndDelete({ username });
  } else if (role === "superadmin" && existingRole.role !== "superadmin") {
    const newSuperAdmin = new SuperAdmin({
      username,
      role,
      email: user.email,
      phone_number: user.phone_number,
    });
    await newSuperAdmin.save();
  }
  // Update role
  existingRole.role = role;
  await existingRole.save();

  res.status(200).json({ message: "Role updated successfully" });
});

// Middleware to check if username is admin
const isAdmin = async (req, res, next) => {
  const { username } = req.body;
  try {
    const userRole = await Role.findOne({ username });
    if (userRole.role === "admin") {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Forbidden: Only admins can perform this action" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if username is superadmin
const isSuperAdmin = async (req, res, next) => {
  const { username } = req.body;
  try {
    const userRole = await Role.findOne({ username });
    if (userRole.role === "superadmin") {
      next();
    } else {
      res
        .status(403)
        .json({
          message: "Forbidden: Only superadmins can perform this action",
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete user route for Admins
app.delete("/admin/user", isAdmin, async (req, res) => {
  const { usernameToDelete } = req.body;

  // Admins can't delete other admins
  const adminToDelete = await Admin.findOne({ username: usernameToDelete });
  if (adminToDelete) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admins cannot delete other admins" });
  }

  // Admins can't delete a superadmin
  const superAdminToDelete = await SuperAdmin.findOne({
    username: usernameToDelete,
  });
  if (superAdminToDelete) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admins cannot delete a superadmin" });
  }

  // Delete user and their role
  await User.findOneAndDelete({ username: usernameToDelete });
  await Role.findOneAndDelete({ username: usernameToDelete });
  res.status(200).json({ message: "User deleted successfully" });
});

// delete user route for superAdmins
app.delete("/superadmin/user", isSuperAdmin, async (req, res) => {
  const { usernameToDelete } = req.body;

  // Deleting user
  await User.findOneAndDelete({ username: usernameToDelete });
  await Role.findOneAndDelete({ username: usernameToDelete });
  await Admin.findOneAndDelete({ username: usernameToDelete });
  res.status(200).json({ message: "User deleted successfully" });
});

app.listen(3555, () => {
  console.log("Server is running");
});
