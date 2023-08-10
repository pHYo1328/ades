const customerServices = require('../services/customer.services');
const chalk = require('chalk');

const deleteUserCustomer = async (req, res) => {
    try {
      const { customer_id } = req.body;
      console.log('try catch in controller!!');
      console.log('delete controller customer_id', customer_id);
      const result = await customerServices.deleteUserByCustomerId(customer_id);
      console.log('in controller', result);
      if (!result) {
        throw new Error('User not found');
      }
  
      console.log(chalk.green('User deleted successfully'));
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(chalk.red('Error in deleting user: ', error));
      res.status(500).json({ error: 'Failed to delete user' });
    }
  };
  
  module.exports = { deleteUserCustomer };
  