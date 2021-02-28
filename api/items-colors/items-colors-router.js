const router = require('express').Router();
const ItemsInfo = require('./items-colors-model');
const {
	checkForDuplicateColors
} = require('./items-colors-validation');

//post item-colors
router.post(
	'/:item_id',
	checkForDuplicateColors,
	async (req, res) => {
		const item_id = req.params.item_id;
		console.log('req.body', req.body.fields);
		ItemsInfo.addItemColors(item_id, req.body.fields)
			.then((item) => {
				res.status(201).json(item);
			})
			.catch((error) => {
				res.status(500).json({
					message: `Error on server end posting colors for item with id ${item_id}.`,
					error
				});
			});
	}
);

//get item colors by item_id
router.get('/:item_id', (req, res) => {
	const item_id = req.params.item_id;

	ItemsInfo.findColorsByItemId(item_id)
		.then((item_colors) => {
			console.log('item_colors', item_colors);
			if (item_colors.length > 0) {
				let colors_dict = {};
				for (let i = 0; i < item_colors.length; i++) {
					// eslint-disable-next-line prettier/prettier
					colors_dict[item_colors[i].color] = item_colors[i].color_id;
				}
				res
					.status(200)
					.json({ item_id: item_id, colors: colors_dict });
			} else {
				res.status(400).json({
					message: `No colors have been added for item with id ${item_id}. Error on client end.`
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error on server end getting colors for item with id ${item_id}.`,
				error
			});
		});
});

//get items by color_id
router.get('/color/:color_id', (req, res) => {
	const color_id = req.params.color_id;

	ItemsInfo.findItemsByColorId(color_id)
		.then((items) => {
			if (items.length > 0) {
				res.status(200).json(items);
			} else {
				res.status(400).json({
					message: `No items exist which list the color with id ${color_id}. Error on client end.`
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error on server end getting all items listing the color with id ${color_id}.`,
				error
			});
		});
});

//delete item color by item_id and color_id
router.delete('/:item_id', (req, res) => {
	const item_id = req.params.item_id;
	const color_id = req.body.color_id;

	ItemsInfo.removeItemColor(item_id, color_id)
		.then((item_color) => {
			console.log('item_color', item_color);
			if (item_color.length > 0) {
				res.status(200).json({
					message: `Color with id ${color_id} deleted from record of garment with id ${item_id}.`
				});
			} else {
				res.status(400).json({
					message: `No record with item_id ${item_id} and material_id ${color_id} exists.`
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error on server end deleting color from item with id ${item_id}.`,
				error
			});
		});
});

module.exports = router;
