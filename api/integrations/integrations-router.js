const router = require('express').Router();
const queryString = require('query-string');

const Integrations = require('./integrations-model');
const Items = require('../items/items-model');
const PinterestAPIService = require('../services/pinterest_api_service');
const pinterestAPI = new PinterestAPIService();

router.get('/auth/pinterest', async (req, res) => {
  // Redirect to Pinterest OAuth
  const serializedParams = queryString.stringify(req.query);
  const queryParams = queryString.stringify({
    response_type: 'code',
    client_id: pinterestAPI.clientId,
    redirect_uri: pinterestAPI.redirectUri,
    scope: 'boards:read boards:write pins:read pins:write',
    state: serializedParams
  });

  res.redirect(`https://www.pinterest.com/oauth/?${queryParams}`);
});

// Callback route from Pinterest OAuth
router.get('/auth/pinterest/callback', async (req, res) => {
  const { code } = req.query;
  console.log('Received Code:', { code });

  try {
    const tokenResponseData = await pinterestAPI.getAccessToken(
      code
    );
    console.log('Token Reponse Data:', tokenResponseData);

    res.redirect(`http://localhost:3000/?pinterestOauth=success`); // Redirect to a dashboard or another page
  } catch (error) {
    console.error(
      'Error exchanging code for an access token',
      error
    );
    res.status(500).json({
      message: 'Authentication failed'
    });
  }
});

router.post('/pinterest/boards', async (req, res) => {
  try {
    // Retrieve the access token for the authenticated user
    const accessToken = await Integrations.getValidAccessToken(
      'pinterest',
      req.sessionID
    );
    const board = {
      name: '1800s Garments',
      description: 'Historical clothing records from the 1800s'
    };
    // Call the getBoards method of PinterestAPIService
    const newBoard = await pinterestAPI.createBoard(
      accessToken,
      board
    );

    // Return the fetched boards
    res.status(200).json(newBoard);
  } catch (error) {
    // Handle errors (e.g., network issues, invalid access token)
    res.status(500).json({
      message: 'Failed to create Pinterest Board',
      error: error.toString()
    });
  }
});

router.get('/pinterest/boards', async (req, res) => {
  try {
    // Retrieve the access token for the authenticated user
    const accessToken = await Integrations.getValidAccessToken(
      'pinterest',
      req.sessionID
    );

    // Call the getBoards method of PinterestAPIService
    const boards = await pinterestAPI.getBoards(accessToken);

    // Return the fetched boards
    res.status(200).json(boards);
  } catch (error) {
    // Handle errors (e.g., network issues, invalid access token)
    res.status(500).json({
      message: 'Failed to fetch Pinterest boards',
      error: error.toString()
    });
  }
});

router.get('/pinterest/board', async (req, res) => {
  try {
    // Retrieve the access token for the authenticated user
    const accessToken = await Integrations.getValidAccessToken(
      'pinterest',
      req.sessionID
    );

    // Call the getBoards method of PinterestAPIService
    const boards = await pinterestAPI.getBoard(
      accessToken,
      '101471866543589310'
    );

    // Return the fetched boards
    res.status(200).json(boards);
  } catch (error) {
    // Handle errors (e.g., network issues, invalid access token)
    res.status(500).json({
      message: 'Failed to fetch Pinterest boards',
      error: error.toString()
    });
  }
});

router.get('/pinterest/pin', async (req, res) => {
  try {
    // Retrieve the access token for the authenticated user
    const accessToken = await Integrations.getValidAccessToken(
      'pinterest',
      req.sessionID
    );

    // Call the getBoards method of PinterestAPIService
    const pin = await pinterestAPI.getPin(
      accessToken,
      '101471797847970338'
    );

    // Return the fetched boards
    res.status(200).json(pin);
  } catch (error) {
    // Handle errors (e.g., network issues, invalid access token)
    res.status(500).json({
      message: 'Failed to fetch Pinterest pin',
      error: error.toString()
    });
  }
});

router.post('/pinterest/pin', async (req, res) => {
  try {
    // Retrieve the access token for the authenticated user
    const accessToken = await Integrations.getValidAccessToken(
      'pinterest',
      req.sessionID
    );

    const { item_id, board_id } = req.body;

    // Call the findItemById method of items-model.js
    const itemData = await Items.findItemById(item_id);

    if (!itemData) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const pinData = {
      title: itemData.garment_title,
      description: itemData.description,
      link: `https://thegenuinearticle.co/garments/${itemData.id}`,
      image_url: itemData.image_urls.main_image_url
    };

    // Call the createPin method of PinterestAPIService
    const pin = await pinterestAPI.createPin(
      accessToken,
      pinData,
      board_id
    );

    // Return the created pin
    res.status(200).json(pin);
  } catch (error) {
    // Handle errors (e.g., network issues, invalid access token)
    res.status(500).json({
      message: 'Failed to create Pin',
      error: error.toString()
    });
  }
});

module.exports = router;
