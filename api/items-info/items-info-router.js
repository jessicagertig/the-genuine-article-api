const router = require('express').Router();
const ItemsInfo = require('../items-info/items-info-model');
const {
  checkForDuplicateUrl
} = require('../items/items-middleware');

// post a url and have item-info scraped
// currently options are 'MET'
// body format: { "url": "", "src": "MET"}
router.post('/', checkForDuplicateUrl, async (req, res) => {
  console.log('BODY:', req.body);
  const url = req.body.url;
  const src = req.body.src;
  try {
    const newItem = await ItemsInfo.addScrapedItemInfo(src, url);
    return res.status(201).json(newItem);
  } catch (error) {
    return res
      .status(500)
      .json({ Message: 'Error creating new item.', error });
  }
});

module.exports = router;
