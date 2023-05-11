const loginServices = require("../services/login.services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { access_token_secret,refresh_token_secret } = require("../config/config");
const chalk = require("chalk");


const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required." });
  
    try {
      // call loginUser API from loginServices.js
      const results = await loginServices.loginUser(username);
      console.log(chalk.green(results));
      
      // evaluate password
      const foundUser = results[0];
      const match = await bcrypt.compare(password, foundUser.password);
      if (match) {  
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
              roles: roles,
            },
          },
          access_token_secret,
          { expiresIn: "10s" }
        );
        const newRefreshToken = jwt.sign(
          { username: foundUser.username },
          refresh_token_secret,
          { expiresIn: "20s" }
        );

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
    // I changed to check is array or not cuz inside database no refreshToken
    // There is something to change feel free to change
      ? (Array.isArray(foundUser.refreshToken)? foundUser.refreshToken : []) 
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        console.log("attempted refresh token reuse at login!");
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    // here I don't know what is foundUser.save();
    // const result = await foundUser.save();
    // console.log(result);
    // console.log(roles);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log("Cookie set successfullyyy");

    // Send authorization roles and access token to user
    res.json({ roles, accessToken });
  } else {
    res.sendStatus(401);
  }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogin };