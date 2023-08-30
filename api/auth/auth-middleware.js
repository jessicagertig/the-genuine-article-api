module.exports = {
  permit
};

// middleware factory function
// returns a function
function permit(...allowedRoles) {
  return (req, res, next) => {
    const { user } = req;

    if (user && allowedRoles.includes(user.role)) {
      next(); // role is allowed, so continue on the next middleware
    } else {
      res.status(403).json({
        message:
          'You do not have permission to access this resource.'
      }); // user is forbidden
    }
  };
}
