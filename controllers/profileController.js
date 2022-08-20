// create express controller
// Import here
const User = require("../models/User");

// @desc   - Get profile Information
// @route  - GET /api/profile/me
// @access - Private
exports.getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({ success: true, user });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Update profile Information
// @route  - PUT /api/profile/edit
// @access - Private
exports.updateProfile = async (req, res) => {
  const { fullName, phoneNumber, jobTitle, company, location, id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          fullName,
          phoneNumber,
          jobTitle,
          company,
          location,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res
        .status(200)
        .json({ success: true, message: "Profile updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};
