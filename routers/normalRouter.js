// create express route
const express = require("express");
const { dashboard } = require("../controllers/dashboardController");
const { checkUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/dashboard", checkUser, dashboard);

module.exports = router;
