const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  // write schemas here
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  company: {
    type: String,
  },
  location: {
    type: String,
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dpng7p48z/image/upload/v1629169721/profiles/default_profile.png",
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
