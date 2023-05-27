// Authentication middleware
const authenticateUser = (req, res, next) => {
    // Perform user authentication, retrieve user information, and determine roles
    const user = // Retrieve user information based on authentication
  
    // Assign the user's roles to req.user.roles
    req.user = {
      ...req.user,
      roles: user.roles
    };
  
    next();
  };
  
  module.exports = authenticateUser;
  