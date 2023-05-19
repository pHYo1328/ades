// const { user } = require('../config/config');
const loginServices = require('../services/login.services');

const verifyOTP =  async (req, res) => {
    const { otp } = req.body;
  
    try {
        console.log("im inside verifyOTPcONTROLELTSRIGN");
      const verificationResult = await loginServices.verifyOTP(otp);
  
      if (verificationResult) {
        // OTP verification successful
        console.log("successful OTP verification");
        res.sendStatus(200);
      } else {
        // Invalid OTP
        console.log("invalid OTP verification");
        res.sendStatus(401);
      }
    } catch (error) {
      // Handle any error that occurred during the OTP verification
      console.error(error);
      res.sendStatus(500);
    }
  };

  
module.exports = { verifyOTP };