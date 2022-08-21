exports.generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    const randValue = Math.floor(Math.random() * 9);
    otp = otp + randValue;
  }
  return otp;
};
