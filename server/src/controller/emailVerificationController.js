const verificationEmailServices = require('../services/forgotPasswordEmail');

const sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const response = await verificationEmailServices.ForgotPasswordEmailSender(email);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { sendForgotPasswordEmail };
