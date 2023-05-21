const loginService = require('../services/login.services');

const retrieveUserInformation = async (req, res) => {
  try {
    const users = await loginService.retrieveUsersInfo();
    console.log("got users info");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving user information');
  }
};

module.exports = { retrieveUserInformation };