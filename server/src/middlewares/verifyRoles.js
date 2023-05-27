const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const roles = req.user.roles; // Access roles from req.user

    if (!roles || !Array.isArray(roles)) {
      console.log("inside verifyRoles middleware");
      return res.sendStatus(401); 
    }

    const result = roles.some((role) => allowedRoles.includes(role));
    if (!result) {
      return res.sendStatus(401);
    }

    next();
  };
};

module.exports = verifyRoles;
