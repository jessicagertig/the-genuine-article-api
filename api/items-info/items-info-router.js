const router = require('express').Router();
const ItemsInfo = require('../items-info/items-info-model');
const {
  checkForDuplicateUrl
} = require('../items/items-middleware');
const restricted = require('../auth/restricted_middleware');
const { permit } = require('../auth/auth-middleware');

// post a url and have item-info scraped
// currently options are 'MET' 'VA' or 'CAM'
// body format: { "url": "" }
router.post(
  '/',
  restricted,
  permit('admin'),
  checkForDuplicateUrl,
  async (req, res) => {
    console.log('BODY:', req.body);
    const url = req.body.url;
    try {
      const newItem = await ItemsInfo.addScrapedItem(url);
      return res.status(201).json(newItem);
    } catch (error) {
      return res
        .status(500)
        .json({ Message: 'Error creating new item.', error });
    }
  }
);

module.exports = router;
