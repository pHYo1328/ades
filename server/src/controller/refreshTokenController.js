const loginServices = require('../services/login.services');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log('cookies', cookies);
  console.log('my cookies.jwt is ' + cookies.refreshToken);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  try {
    // Find the user with the given refreshToken
    const foundUser = await loginServices.findUserByRefreshToken(refreshToken);

    console.log('fu', foundUser);

    if (!foundUser) {
      // Detected refresh token reuse!
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        console.log('attempted refresh token reuse!');

        const hackedUser = await loginServices.findUserByUsername(
          decoded.username
        );
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log('start', result);

        return res.sendStatus(403); // Forbidden
      } catch (err) {
        console.log('expired refresh token');
        return res.sendStatus(403); // Forbidden
      }
    }
    console.log(foundUser[0].refreshToken);
    console.log(refreshToken);
    console.log(foundUser[0].refreshToken == refreshToken);

    const newRefreshTokenArray = foundUser.filter(
      (rt) => rt.refreshToken !== refreshToken || null
    );

    console.log('refreshtokenarray is ' + newRefreshTokenArray);

    try {
      // Evaluate jwt
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      console.log(decoded.username);
      console.log(foundUser[0].username);
      if (foundUser[0].username != decoded.username) {
        console.log('not same');
        return res.sendStatus(403); // Forbidden
      }

      // Refresh token was still valid
      const roles = Object.values(foundUser[0].roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' } // Gets new access token every 10s
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1m' } // When expired, kicks user to the login page
      );
      console.log('created refresh token is ' + newRefreshToken);

      // Update the refreshToken with the current user
      newRefreshTokenArray.push(newRefreshToken); // Add the new refresh token to the array

      const [updateResult] = await loginServices.updateRefreshToken(
        newRefreshTokenArray,
        foundUser[0].userid
      );
      console.log(newRefreshTokenArray);
      console.log('Number of affected rows:', updateResult?.affectedRows);
      console.log('new refresh token of current user', updateResult);

      // Creates Secure Cookie with refresh token
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      });
      console.log(cookies);
      res.json({ roles, accessToken });
    } catch (err) {
      console.log('expired refresh token at the end');
      const result = await loginServices.updateRefreshToken(
        newRefreshTokenArray,
        foundUser.userid
      );
      console.log('end ' + result[0][0]);
      return res.sendStatus(403); // Forbidden
    }
  } catch (err) {
    console.log('error finding user:', err);
    return res.sendStatus(500); // Internal Server Error
  }
};

module.exports = { handleRefreshToken };
