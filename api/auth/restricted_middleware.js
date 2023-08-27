const jwt = require('jsonwebtoken');
const UserAuth = require('./auth-model');

module.exports = (req, res, next) => {
  let token = null;
  const auth_header = req.headers.authorization;

  // ensure correctly formatted auth header
  if (auth_header.startsWith('Bearer ')) {
    token = auth_header.substring(7, auth_header.length);
  } else {
    res
      .status(401)
      .json({ message: 'Invalid authorization header.' });
  }

  if (token) {
    const secret = process.env.JWT_SECRET;

    jwt.verify(token, secret, function (err, decodedToken) {
      if (err) {
        res.status(401).json({
          message: 'You are not authorized.',
          err
        });
      } else {
        // get user from database
        UserAuth.findById(decodedToken.id)
          .then((user) => {
            if (user) {
              req.user = user;
              next();
            } else {
              res.status(401).json({ message: 'User not found!' });
            }
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: 'Error retrieving user!', err });
          });
      }
    });
  } else {
    res.status(400).json({ message: 'No token provided.' });
  }
};
