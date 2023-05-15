
const loginServices = require('../services/login.services');
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log("cookies", cookies.jwt);
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  
    // Find the user with the given refreshToken
    const foundUser = await loginServices.findUserByRefreshToken(refreshToken);
    
    console.log("fu", foundUser);
  
    // Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            console.log("expired refresh token");
            return res.sendStatus(403);
          } // Forbidden
          console.log("attempted refresh token reuse!");
          const hackedUser = await loginServices.findUserByUsername(decoded.username);
          hackedUser.refreshToken = [];
          const result = await hackedUser.save();
          console.log(result);
        }
      );
      return res.sendStatus(403); // Forbidden
    }
  
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );
  
    // Evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log("expired refresh token");
          const result = await loginServices.updateRefreshToken([...newRefreshTokenArray, newRefreshToken], foundUser.id);
          console.log(result);
        }
        if (err || foundUser.username !== decoded.username) {
          console.log("not same");
          return res.sendStatus(403);
        }
        // Refresh token was still valid
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.username,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10s" } // Gets new access token every 10s
        );
  
        const newRefreshToken = jwt.sign(
          { username: foundUser.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "20s" } // When expired, kicks user to the login page
        );
  
        // Update the refreshToken with the current user
        const result = await loginServices.updateRefreshToken([...newRefreshTokenArray, newRefreshToken], foundUser.id);
        console.log("new refresh token of current user" + result);

        // Creates Secure Cookie with refresh token
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });
  
        res.json({ roles, accessToken });
      }
    );
  };
  

module.exports = { handleRefreshToken };
