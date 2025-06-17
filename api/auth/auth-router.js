const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserAuth = require('./auth-model');
const restricted = require('./restricted_middleware');
const { permit } = require('./auth-middleware');

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  UserAuth.add(user)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;

  UserAuth.findBy({ email }).then((user) => {
    console.log('email', email);
    console.log('user', user);
    if (user && bcrypt.compareSync(password, user.password)) {
      // sign token
      const token = signToken(user);

      const returned_user = {
        username: user.username,
        email: user.email,
        role: user.role
      };

      // send the token
      res.status(200).json({
        user: returned_user,
        token: token // added token as part of the response sent
      });
    } else {
      res.status(401).json({
        message:
          'Error logging in, please check your email and password!'
      });
    }
  });
});

router.get('/', restricted, async (req, res) => {
  console.log('Request:', req.params);
  const user = req.user;
  if (user) {
    res.status(200).json({
      username: user.username,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(401).json({
      message: 'Unauthenticated!'
    });
  }
});

router.delete(
  '/:user_id',
  restricted,
  permit('admin'),
  async (req, res) => {
    const user_id = req.params.user_id;
    console.log('Deleting user', req.params.user_id);
    if (user_id) {
      UserAuth.destroy(user_id)
        .then(() => {
          res.status(200).json({
            message: 'user deleted'
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: `Error: ${error}`
          });
        });
    } else {
      return res.status(400).json({
        message: 'User id invalid!'
      });
    }
  }
);

// this functions creates and signs the token
function signToken(user) {
  const payload = {
    username: user.username,
    id: user.id
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: '6h'
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
