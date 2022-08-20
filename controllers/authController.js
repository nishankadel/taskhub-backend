// create express controller
// Import here
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendToken } = require("../middlewares/jwtToken");

// @desc   - Login to account
// @route  - POST /api/auth/login
// @access - Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let existingUser;
    try {
      existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.json({
          success: false,
          message: "Email doesn't exist.",
        });
      } else {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isPasswordCorrect) {
          return res.json({
            success: false,
            message: "Invalid credentials.",
          });
        }

        const token = sendToken(existingUser._id);

        return res.json({
          success: true,
          message: "User Logged in successfully.",
          token,
          user: existingUser,
        });
      }
    } catch (error) {
      res.json({
        success: false,
        message: "Something went wrong",
      });
      console.log(error);
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Register to account
// @route  - POST /api/auth/register
// @access - Public
exports.register = async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    jobTitle,
    company,
    location,
    password,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        fullName,
        email,
        phoneNumber,
        jobTitle,
        company,
        location,
        password: hashedPassword,
      });
      await user.save();
      res.json({
        success: true,
        message: "User registered successfully",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};
