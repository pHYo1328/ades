const customerService = require('../services/customer.services');

const userProfileInformation = async (req, res) => {
  console.log("inside user profile controller");
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
module.exports = { userProfileInformation };
