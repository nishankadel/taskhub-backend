// create express controller
// Import here
const User = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const bcrypt = require("bcryptjs");
const { sendToken } = require("../middlewares/jwtToken");
const { generateOTP } = require("../middlewares/OTP");
const { sendEmail } = require("../middlewares/sendEmail");
const { isValidObjectId } = require("mongoose");

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
      } else if (existingUser.emailVerified === false) {
        return res.json({
          success: false,
          message: "Please verify your email to login.",
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

      const pin = generateOTP();
      const verificationToken = new VerificationToken({
        owner: user._id,
        token: pin,
      });

      await verificationToken.save();
      await user.save();
      await sendEmail(
        user.email,
        "d-3a474186823343969983726f982c4dd8",
        user.fullName,
        pin
      );
      res.json({
        success: true,
        message: "User registered successfully.",
        user,
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Verify account
// @route  - POST /api/auth/verify
// @access - Public
exports.verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    if (!userId || !otp.trim()) {
      return res.json({
        success: false,
        message: "Invalid request, missing parameters.",
      });
    }
    if (!isValidObjectId(userId)) {
      return res.json({
        success: false,
        message: "Invalid user id.",
      });
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }
    if (user.emailVerified) {
      return res.json({
        success: false,
        message: "User already verified. You can login now.",
      });
    }

    const token = await VerificationToken.findOne({ owner: userId });
    if (!token) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatched = await token.compareToken(otp);
    if (!isMatched) {
      return res.json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    user.emailVerified = true;
    await VerificationToken.findByIdAndDelete({ _id: token._id });
    await user.save();
    res.json({
      success: true,
      message: "User verified successfully. You can login now.",
    });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};
