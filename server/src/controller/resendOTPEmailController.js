const OTPEmailServices = require('../services/loginOTPEmail');

const loginOTPEmail = async (req, res) => {
    const { username } = req.body; 
  
    try {
      const response = await OTPEmailServices.OTPEmailSender(username);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = { loginOTPEmail };
