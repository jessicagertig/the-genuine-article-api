const Colors = require('./items-colors-model');

const checkForDuplicateColors = async (req, res, next) => {
	const item_id = req.params.item_id;
	// eslint-disable-next-line prettier/prettier
	const currentMaterials = await Colors.findColorsByItemId(item_id);

	if (currentMaterials.length > 0) {
		const color_ids = currentMaterials.map((item) => item.color_id);
		let ids_set = new Set(color_ids);
		let incoming = req.body.fields;
		for (let i = 0; i < incoming.length; i++) {
			if (ids_set.has(incoming[i].id) === true) {
				res.status(400).json({
					message: `Duplicate color. Please remove the color ${incoming[i].color} and try again.`
				});
			}
			next();
		}
	} else {
		next();
	}
};

module.exports = {
	checkForDuplicateColors
};
