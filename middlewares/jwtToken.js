const jwt = require("jsonwebtoken");
require("dotenv").config();

const sendToken = (id) => {
  const token = jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET_KEY
  );
  return token;
};

module.exports = {
  sendToken,
};
