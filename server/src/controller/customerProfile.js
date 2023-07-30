const bcrypt = require('bcrypt');
const customerService = require('../services/customer.services');

exports.userProfileInformation = async (req, res) => {
  console.log('inside user profile controller');
  try {
    const customer_id = req.headers['customer-id'];
    console.log(customer_id);
    const users = await customerService.retrieveUserInfo(customer_id);
    console.log('got user"s info in ', customer_id);
    console.log(users[0][0]);
    res.json(users[0][0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving user information');
  }
};

exports.updateUserProfile = async (req, res) => {
  console.log('In updateUserProfile controller');

  const { customer_id, username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await customerService.updateUserInfo(
      customer_id,
      username,
      email,
      hashedPassword
    );
    console.log('User information updated successfully.');
    res.status(200).json({ message: 'User information updated successfully.' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ message: 'Error updating user information.' });
  }
};

exports.updateProfileImage = async (req, res) => {
  console.log('in updateProfileImage');

  const { image_url, customer_id } = req.body;

  try {
    await customerService.updateProfileImage(image_url, customer_id);
    console.log('User profile image updated successfully');
    res.status(200).json({ message: 'User image updated successfully' });
  } catch (error) {
    console.error('Error in updating user profile image: ', error);
    res.status(500).json({ message: 'Error updating user image information' });
  }
};
