const loginServices = require('../services/login.services');

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  console.log(req.cookies);
  if (!cookies?.refreshToken) return res.sendStatus(204); // No content
  const refreshToken = cookies.refreshToken;
  try {
    const logoutSuccess = await loginServices.logoutUser(refreshToken);

    if (!logoutSuccess) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      console.log(
        'Successful logout but refreshToken not found in the database.'
      );
      return res.sendStatus(204);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    console.log('Successful logout! RefreshToken removed from the database.');
    res.sendStatus(204);
  } catch (error) {
    console.error('Error in handling logout: ', error);
    res.sendStatus(500);
  }
};

module.exports = { handleLogout };
