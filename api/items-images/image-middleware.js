const Images = require('./items-images-model');

module.exports = (req, res, next) => {
	const incomingItemId = req.params.item_id;
	Images.findMainImageByItemId(incomingItemId).then((item_image) => {
		if (item_image === undefined) {
			next();
		} else {
			res.status(400).json({
				error:
					'This should be an edit, not an add, item image already exists.'
			});
		}
	});
};
