const Items = require('./items-model');

const checkForRequestBody = (req, res, next) => {
  if (!req.body.item_info) {
    res.status(400).json({
      message: 'Please include item_info in the request body.'
    });
  } else if (!req.body.item_colors) {
    res.status(400).json({
      message: 'Please include item_colors in the request body.'
    });
  } else if (!req.body.item_materials) {
    res.status(400).json({
      message: 'Please include item_materials in the request body.'
    });
  } else {
    next();
  }
};

const checkForDuplicateItem = async (req, res, next) => {
  const new_collection_url = req.body.item_info.collection_url;
  const new_collection_no = req.body.item_info.item_collection_no;

  const existing_url = await Items.findByCollectionUrl(
    new_collection_url
  );
  const existing_collection_no = await Items.findByCollectionNo(
    new_collection_no
  );

  if (
    existing_url === undefined &&
    existing_collection_no === undefined
  ) {
    next();
  } else if (
    existing_url !== undefined &&
    existing_collection_no !== undefined
  ) {
    res.status(400).json({
      message: `An item, id no. ${existing_url.id}, with the url ${existing_url.collection_url} and collection no. ${existing_collection_no.item_collection_no} already exists.`
    });
  } else if (
    existing_url !== undefined &&
    existing_collection_no === undefined
  ) {
    res.status(400).json({
      message: `An item with url ${existing_url.collection_url} exists. The collection url may not be correct. Please review item with id no. ${existing_url.id} and verify the collection url is correct.`
    });
  } else if (
    existing_url === undefined &&
    existing_collection_no !== undefined
  ) {
    res.status(400).json({
      message: `An item with collection no. ${existing_collection_no.item_collection_no} exists. The collection no. may not be correct. Please review item with id no. ${existing_collection_no.id} and verify the collection no. is correct.`
    });
  }
};

module.exports = {
  checkForDuplicateItem,
  checkForRequestBody
};
