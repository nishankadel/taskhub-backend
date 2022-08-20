// create express route
const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { checkUser } = require("../middlewares/auth");

const router = express.Router();

router.get("/me/:id", checkUser, getProfile);
router.post("/edit", checkUser, updateProfile);

module.exports = router;
