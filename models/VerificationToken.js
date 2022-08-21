const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const VerificationTokenSchema = mongoose.Schema({
  // write schemas here
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

VerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const hash = await bcrypt.hash(this.token, 8);
    this.token = hash;
  }
  next();
});

VerificationTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

const VerificationToken = mongoose.model(
  "VerificationToken",
  VerificationTokenSchema
);

module.exports = VerificationToken;
