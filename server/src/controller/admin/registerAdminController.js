const adminLoginServices = require('../../services/adminLogin.services');
const bcrypt = require('bcrypt');

const handleNewAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // registers the new admin
    const result = await adminLoginServices.registerAdmin(
      username,
      email,
      hashedPwd,
      'admin'
    );

    console.log(result);

    res.status(201).json({ success: `New admin ${username} created!` });  //Admin successfully created
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewAdmin };
