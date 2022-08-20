const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const checkUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById({ _id: decoded.id }).select("-password");
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Not authorized to this resource.",
      });
    }
  }
  if (!token) {
    res.json({
      success: false,
      message: "Token is not provided.",
    });
  }
};

module.exports = { checkUser };
