const adminLoginServices = require('../../services/adminLogin.services');

const handleForgotPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      // Update the password
      const result = await adminLoginServices.forgotPassword(email, password); // Pass email and plain text password
      if (!result) {
        return res.status(404).json({ message: 'Password update failed for admin.' }); //wrong email or same password as previous
      } 
      res.status(200).json({ message: 'Password updated successfully for admin!' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  module.exports = { handleForgotPassword };