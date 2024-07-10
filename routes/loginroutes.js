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
} = require("../controller/registration");

const { StudentSignup } = require("../controller/student");

router.get("/login", UserLogin);
router.get("/", Test);
router.get("/check-email", ValidateEmail);
router.get("/check-phone", ValidatePhone);
router.get("/check-username", ValidateUserID);

router.post("/signup-student", StudentSignup);

// Assign role route
router.post("/assignrole", AssignRole);
// Update role route
router.patch("/updaterole", UpdateRole);

router.delete("/superadmin/user", RemoveAdmin);
router.delete("/admin/user", RemoveSuperAdmin);

module.exports = router;
