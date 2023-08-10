// const { user } = require('../config/config');
const loginServices = require('../services/login.services');
//with expiry timer
const verifyOTP = async (req, res) => {
  const { otp, username } = req.body;
  console.log("in new verifyOTP controller");
  try {
    const verificationResult = await loginServices.verifyOTPWithExpiry(username, otp);

    if (verificationResult) {
      // OTP verification successful
      console.log('successful OTP verification');
      res.sendStatus(200);
    } else {
      // Invalid OTP
      console.log('invalid OTP verification or OTP expired');
      res.sendStatus(401);
    }
  } catch (error) {
    // Handle any error that occurred during the OTP verification
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { verifyOTP };


//without expiry timer
// const verifyOTP = async (req, res) => {
//   const { otp } = req.body;

//   try {
//     const verificationResult = await loginServices.verifyOTP(otp);

//     if (verificationResult) {
//       // OTP verification successful
//       console.log('successful OTP verification');
//       res.sendStatus(200);
//     } else {
//       // Invalid OTP
//       console.log('invalid OTP verification');
//       res.sendStatus(401);
//     }
//   } catch (error) {
//     // Handle any error that occurred during the OTP verification
//     console.error(error);
//     res.sendStatus(500);
//   }
// };