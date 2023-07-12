const verificationEmailServices = require('../../services/adminForgotPasswordEmail');

const sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const response =
      await verificationEmailServices.AdminForgotPasswordEmailSender(email);
    console.log('admin forgot passwrod email sent');
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { sendForgotPasswordEmail };
