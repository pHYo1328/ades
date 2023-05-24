const adminServices = require('../services/admin.services');
const chalk = require('chalk');

const deleteUser = async (req, res) => {
  try {
    const { userid } = req.body; // Extract the userid from the request body
    console.log('try catch in controller!!');
    console.log('controller userid', userid);
    const result = await adminServices.deleteUser(userid);
    console.log('in controller', userid);
    if (result.affectedRows === 0) {
      // No user was deleted, handle this case
      throw new Error('User not found');
    }

    console.log(chalk.green('User deleted successfully'));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(chalk.red('Error in deleting user: ', error));
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = { deleteUser };
