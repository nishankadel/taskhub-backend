// create express route
const express = require("express");
const {
  login,
  register,
  verifyEmail,
} = require("../controllers/authController");
const { userValidation } = require("../middlewares/userValidation");

const router = express.Router();

router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/register", userValidation, register);

module.exports = router;
