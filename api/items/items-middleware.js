const ItemsInfo = require('../items-info/items-info-model');

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

  const existing_url = await ItemsInfo.findByCollectionUrl(
    new_collection_url
  );
  const existing_collection_no = await ItemsInfo.findByCollectionNo(
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
      message: `An item with url ${existing_url.collection_url} exists. Please review existing item with id no. ${existing_url.id} and verify the collection url is correct.`
    });
  } else if (
    existing_url === undefined &&
    existing_collection_no !== undefined
  ) {
    res.status(400).json({
      message: `An item with collection no. ${existing_collection_no.item_collection_no} exists. Please review the existing item with id no. ${existing_collection_no.id} and verify the collection no. is correct.`
    });
  }
};

const checkForDuplicateUrl = async (req, res, next) => {
  const new_collection_url = req.body.url;

  const existing_url = await ItemsInfo.findByCollectionUrl(
    new_collection_url
  );

  if (existing_url === undefined) {
    next();
  } else if (existing_url !== undefined) {
    res.status(400).json({
      message: `An item with url ${existing_url.collection_url} exists. Please review the existing item with id no. ${existing_url.id} and verify the collection url is correct.`
    });
  }
};

const checkForDuplicatesWhileEditing = async (req, res, next) => {
  const collection_url = req.body.item_info.collection_url;
  const collection_no = req.body.item_info.item_collection_no;
  const item_id = req.params.item_id;

  const existing_item_with_url = await ItemsInfo.findByCollectionUrl(
    collection_url
  );
  const existing_url = existing_item_with_url?.collection_url;

  const existing_item_with_collection_no =
    await ItemsInfo.findByCollectionNo(collection_no);
  const existing_collection_no =
    existing_item_with_collection_no?.item_collection_no;

  const current_item_info = await ItemsInfo.findInfoById(item_id);
  const current_record_url = current_item_info?.collection_url;
  const current_record_collection_no =
    current_item_info?.item_collection_no;

  // console.log('Urls & Collection Nos', {
  //   collection_url,
  //   collection_no,
  //   existing_url,
  //   existing_collection_no,
  //   current_record_url,
  //   current_record_collection_no,
  //   current_item_info
  // });
  const same_url = current_record_url === existing_url;
  const same_collection_no =
    current_record_collection_no === existing_collection_no;

  const diff_item_with_url_exists =
    existing_url !== undefined && !same_url;
  const diff_item_with_collection_no_exists =
    existing_collection_no !== undefined && !same_collection_no;

  if (
    !diff_item_with_url_exists &&
    !diff_item_with_collection_no_exists
  ) {
    next();
  } else if (
    diff_item_with_url_exists &&
    diff_item_with_collection_no_exists
  ) {
    res.status(400).json({
      message: `An item, id no. ${existing_item_with_url?.id}, with url ${existing_url} already exists. And an item, id no. ${existing_item_with_collection_no?.id}, with collection no. ${existing_collection_no} already exists.`
    });
  } else if (diff_item_with_url_exists) {
    res.status(400).json({
      message: `Another item with url ${existing_url} exists. Please review existing item with id no. ${existing_item_with_url?.id}.`
    });
  } else if (diff_item_with_collection_no_exists) {
    res.status(400).json({
      message: `Another item with collection no. ${existing_collection_no} exists. Please review the existing item with id no. ${existing_item_with_collection_no?.id}.`
    });
  }
};

module.exports = {
  checkForDuplicateItem,
  checkForRequestBody,
  checkForDuplicateUrl,
  checkForDuplicatesWhileEditing
};
