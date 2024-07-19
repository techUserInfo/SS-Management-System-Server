const User = require("../models/user");
const Admin = require("../models/admin");
const SuperAdmin = require("../models/supadmin");
const Teacher = require("../models/teacher");
const Role = require("../models/role");
// Assignrole [By Pritom]
exports.AssignRole = async (req, res) => {
  const { UserName, role } = req.body;

  try {
    const user = await User.findOne({ UserName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["admin", "teacher", "student", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingRole = await Role.findOne({ UserName });
    if (existingRole) {
      return res.status(400).json({ message: "Role already assigned" });
    }

    const newRole = new Role({
      UserName,
      role,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
    });
    await newRole.save();

    if (role === "admin") {
      const newAdmin = new Admin({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newAdmin.save();
    }

    if (role === "superadmin") {
      const newSuperAdmin = new SuperAdmin({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newSuperAdmin.save();
    }

    
    if (role === "teacher") {
      const newTeacher = new Teacher({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newTeacher.save();
    }

    res.status(200).json({ message: "Role assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.UpdateRole = async (req, res) => {
  const { UserName, role } = req.body;

  try {
    const user = await User.findOne({ UserName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["admin", "teacher", "student", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingRole = await Role.findOne({ UserName });
    if (!existingRole) {
      return res.status(404).json({ message: "Role not assigned yet" });
    }

    if (existingRole.role === "admin" && role !== "admin") {
      await Admin.findOneAndDelete({ UserName });
    } else if (role === "admin" && existingRole.role !== "admin") {
      const newAdmin = new Admin({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newAdmin.save();
    }

    if (existingRole.role === "superadmin" && role !== "superadmin") {
      await SuperAdmin.findOneAndDelete({ UserName });
    } else if (role === "superadmin" && existingRole.role !== "superadmin") {
      const newSuperAdmin = new SuperAdmin({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newSuperAdmin.save();
    }

    
    if (existingRole.role === "teacher" && role !== "teacher") {
      await Teacher.findOneAndDelete({ UserName });
    } else if (role === "teacher" && existingRole.role !== "teacher") {
      const newTeacher = new Teacher({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newTeacher.save();
    }



    existingRole.role = role;
    await existingRole.save();

    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to check if UserName is admin
const isAdmin = async (req, res, next) => {
  const { UserName } = req.body;
  try {
    const userRole = await Role.findOne({ UserName });
    if (userRole && userRole.role === "admin") {
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

// Middleware to check if UserName is superadmin
const isSuperAdmin = async (req, res, next) => {
  const { UserName } = req.body;
  try {
    const userRole = await Role.findOne({ UserName });
    if (userRole && userRole.role === "superadmin") {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden: Only superadmins can perform this action",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete user route for Admins
exports.RemoveAdmin = async (req, res) => {
  isAdmin ;
  const { UserNameToDelete } = req.body;

  try {
    const adminToDelete = await Admin.findOne({ UserName: UserNameToDelete });
    if (adminToDelete) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admins cannot delete other admins" });
    }

    const superAdminToDelete = await SuperAdmin.findOne({
      UserName: UserNameToDelete,
    });
    if (superAdminToDelete) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admins cannot delete a superadmin" });
    }

    await User.findOneAndDelete({ UserName: UserNameToDelete });
    await Role.findOneAndDelete({ UserName: UserNameToDelete });
    await Teacher.findOneAndDelete({ UserName: UserNameToDelete });


    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user route for superAdmins
exports.RemoveSuperAdmin = async (req, res) => {
  isSuperAdmin;
  const { UserNameToDelete } = req.body;

  try {
    await User.findOneAndDelete({ UserName: UserNameToDelete });
    await Role.findOneAndDelete({ UserName: UserNameToDelete });
    await Admin.findOneAndDelete({ UserName: UserNameToDelete });
    await Teacher.findOneAndDelete({ UserName: UserNameToDelete });


    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.AdminRegCount=async(req,res)=>{
  const date = new Date();
    date.setDate(date.getDate() - 90);
  try {
      const count = await Admin.countDocuments([
        { createdAt: { $gte: date } },
    { _id: '$role'} 
      ]);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};