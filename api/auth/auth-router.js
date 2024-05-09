const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queryString = require('query-string');
const axios = require('axios');

const UserAuth = require('./auth-model');
const restricted = require('./restricted_middleware');
const { permit } = require('./auth-middleware');

router.post('/register', restricted, permit('admin'), (req, res) => {
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

/* PINTEREST */
const PINTEREST_CLIENT_ID = process.env.PINTEREST_APP_ID;
const PINTEREST_CLIENT_SECRET = process.env.PINTEREST_APP_SECRET;
const REDIRECT_URI = 'http://localhost:4000/auth/pinterest/callback';

// Redirect user to Pinterest for authorization
router.get('/pinterest', (req, res) => {
  const queryParams = queryString.stringify({
    response_type: 'code',
    client_id: PINTEREST_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'boards:read boards:write pins:write',
    state: 'yourRandomStringHere' // Should be a random string to prevent CSRF attacks
  });

  res.redirect(`https://www.pinterest.com/oauth/?${queryParams}`);
});

// Callback route from Pinterest OAuth
router.get('/pinterest/callback', async (req, res) => {
  const { code } = req.query;
  console.log('Received Code:', { code });

  // Encode client credentials
  const credentials = Buffer.from(
    `${PINTEREST_CLIENT_ID}:${PINTEREST_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const tokenResponse = await axios.post(
      'https://api.pinterest.com/v5/oauth/token',
      queryString.stringify({
        grant_type: 'authorization_code',
        client_id: PINTEREST_CLIENT_ID,
        code: code,
        redirect_uri: REDIRECT_URI // Make sure this matches the registered URI
      }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('RESPONSE FROM PINTEREST', { tokenResponse });

    const { access_token } = tokenResponse.data;
    // Save the access token in the session or a secure place
    req.session.accessToken = access_token;

    res.redirect('http://localhost:3002/garments'); // Redirect to a dashboard or another page
  } catch (error) {
    console.error(
      'Error exchanging code for an access token',
      error
    );
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
