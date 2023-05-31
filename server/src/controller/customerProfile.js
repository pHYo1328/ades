const customerService = require('../services/customer.services');

const userProfileInformation = async (req, res) => {
  try {
    const customer_id = req.body.customer_id;
    console.log(customer_id);
    const users = await customerService.retrieveUserInfo(customer_id);
    console.log('got users info');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving user information');
  }
};

module.exports = { userProfileInformation };
