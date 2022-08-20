// Import essentials package or modules
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

exports.userValidation = [
  body("fullName").isLength({ min: 3 }).withMessage({
    success: false,
    message: "Full Name must be at least 3 characters long.",
  }),
  body("email")
    .isEmail()
    .withMessage({ success: false, message: "Email is invalid." }),
  body("phoneNumber")
    .matches(/98[0-9]{8}$/)
    .withMessage({ success: false, message: "Phone number is invalid." })
    .isLength({ min: 10, max: 10 })
    .withMessage({
      success: false,
      message: "Phone Number must be 10 digits long.",
    }),
  body("password")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage({
      success: false,
      message:
        "Password must be at least 8 characters long and must contain at least one number, one letter and one special character.",
    }),
  body("email").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject({
          success: false,
          message: "E-mail already exists.",
        });
      }
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json(errors.array()[0]["msg"]);
    next();
  },
];
