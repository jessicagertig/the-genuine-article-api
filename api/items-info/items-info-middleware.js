const Items = require('./items-info-model');

const checkForDuplicateItem = async (req, res, next) => {
	const incoming_collection_url = req.body.collection_url;
	const incoming_collection_no = req.body.item_collection_no;

	const duplicate_url = await Items.findByCollectionUrl(
		incoming_collection_url
	);
	const duplicate_collection_no = await Items.findByCollectionNo(
		incoming_collection_no
	);

	if (
		duplicate_url === undefined &&
		duplicate_collection_no === undefined
	) {
		next();
	} else if (
		duplicate_url !== undefined &&
		duplicate_collection_no !== undefined
	) {
		res.status(400).json({
			message: `An item, id no. ${duplicate_url.id}, with the url ${duplicate_url.collection_url} and collection no. ${duplicate_collection_no.item_collection_no} already exists.`
		});
	} else if (
		duplicate_url !== undefined &&
		duplicate_collection_no === undefined
	) {
		res.status(400).json({
			message: `An item with url ${duplicate_url.collection_url} exists. The collection no. may not be correct. Please review item with id no. ${duplicate_url.id} and verify the collection no. is correct.`
		});
	} else if (
		duplicate_url === undefined &&
		duplicate_collection_no !== undefined
	) {
		res.status(400).json({
			message: `An item with url ${duplicate_collection_no.item_collection_no} exists. The collection url may not be correct. Please review item with id no. ${duplicate_collection_no.id} and verify the collection url is correct.`
		});
	}
};

module.exports = {
	checkForDuplicateItem
};
