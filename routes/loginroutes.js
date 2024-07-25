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
  ValidateRoleTable,
  CheckRolesAccording
} = require("../controller/registration");


 

const { StudentSignup,ValidateStudent } = require("../controller/student");

router.post("/login", UserLogin);
router.get("/", Test);
router.get("/check-email", ValidateEmail);
router.get("/check-phone", ValidatePhone);
router.get("/check-username", ValidateUserID);


router.get("/teachers", ValidateTeacher);
router.get("/admins", ValidateAdmin);
router.get("/roles", ValidateRoleTable);
router.post("/checkrole", CheckRolesAccording);



router.post("/signup-student", StudentSignup);

// Assign role route
router.post("/assignrole", AssignRole);
// Update role route
router.patch("/updaterole", UpdateRole);

router.delete("/superadmin/user", RemoveAdmin);
router.delete("/admin/user", RemoveSuperAdmin);

module.exports = router;
