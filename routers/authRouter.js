// create express route
const express = require("express");
const { login, register } = require("../controllers/authController");
const { userValidation } = require("../middlewares/userValidation");

const router = express.Router();

router.post("/login", login);
router.post("/register", userValidation, register);

module.exports = router;
