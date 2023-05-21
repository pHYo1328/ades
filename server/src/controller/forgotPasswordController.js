const loginServices = require('../services/login.services');

// const handleForgotPassword = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     try {
//       // Encrypt the new password
//       const hashedPwd = await bcrypt.hash(password, 10);

//       // Check if the new password is the same as the previous password
//       const isSameAsPrevious = await loginServices.isSameAsPreviousPassword(email, hashedPwd);
//       if (isSameAsPrevious) {
//         return res.status(400).json({ message: 'Password must be different from the previous password.' });
//       }

//       // Update the password
//       const result = await loginServices.forgotPassword(email, hashedPwd); // Pass email and hashed password
//       console.log(result);
//       if (!result) {
//         return res.status(404).json({ message: 'Password update failed. Incorrect email.' });
//       }

//       res.status(200).json({ message: 'Password updated successfully!' });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

const handleForgotPassword = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Update the password
    const result = await loginServices.forgotPassword(email, password); // Pass email and plain text password
    if (!result) {
      return res.status(404).json({ message: 'Password update failed.' }); //wrong email or same password as previous
    }

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleForgotPassword };
