const jwt = require('jsonwebtoken');
const UserAuth = require('./auth-model');

module.exports = (req, res, next) => {
  const auth_header = req.headers.authorization;
  console.log('auth_header', auth_header);

  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Invalid authorization header.' });
  }

  const token = auth_header.substring(7, auth_header.length);

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, function (err, decodedToken) {
    if (err) {
      return res.status(401).json({
        message: 'You are not authorized.',
        err
      });
    }

    UserAuth.findById(decodedToken.id)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          return res
            .status(404)
            .json({ message: 'User not found!' });
        }
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: 'Error retrieving user!', err });
      });
  });
};
