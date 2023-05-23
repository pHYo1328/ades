const adminLoginServices = require('../../services/adminLogin.services');

const verifyOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    console.log('im inside verifyOTP for ADMINN');
    const verificationResult = await adminLoginServices.verifyOTP(otp);

    if (verificationResult) {
      // OTP verification successful
      console.log('successful OTP verification admin admin');
      res.sendStatus(200);
    } else {
      // Invalid OTP
      console.log('invalid OTP verification for admin');
      res.sendStatus(401);
    }
  } catch (error) {
    // Handle any error that occurred during the OTP verification
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { verifyOTP };
