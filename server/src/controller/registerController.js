const loginServices = require('../services/login.services');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // register the new user
    const result = await loginServices.registerUser(
      username, 
      email,
      hashedPwd,
      'customer'
    );
    
    console.log(result);

    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
