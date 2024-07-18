const express = require("express");
const router = express.Router();

const { UserLogin, Test } = require("../controller/login");


const {
  AssignRole,
  UpdateRole,
  RemoveAdmin,
  RemoveSuperAdmin,
} = require("../controller/admin");

const {
  ValidatePhone,
  ValidateEmail,
  ValidateUserID,
  ValidateTeacher,
  ValidateAdmin,
  UserSignup,
  ValidateRoleTable
} = require("../controller/registration");

const { StudentSignup,ValidateStudent } = require("../controller/student");

router.post("/login", UserLogin);
router.get("/", Test);
router.post("/check-email", ValidateEmail);
router.post("/check-phone", ValidatePhone);
router.post("/check-username", ValidateUserID);

router.get("/teachers", ValidateTeacher)
router.get("/admins", ValidateAdmin)
router.get("/students", ValidateStudent)
router.get("/roles", ValidateRoleTable)




router.post("/signup-student", StudentSignup);
router.post("/signup",UserSignup);

// Assign role route
router.post("/assignrole", AssignRole);
// Update role route
router.patch("/updaterole", UpdateRole);

router.delete("/superadmin/user", RemoveSuperAdmin);
router.delete("/admin/user", RemoveAdmin);

module.exports = router;
