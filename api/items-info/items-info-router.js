const router = require('express').Router();
const ItemsInfo = require('./items-info-model');

const { catchAsync } = require('../utils/catch-async');

router.get('/', (req, res) => {
	ItemsInfo.find()
		.then((items) => {
			res.json(items);
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end.', error });
		});
});

//post item-info, return item info incluing newly created id
router.post('/', async (req, res) => {
	ItemsInfo.addItemInfo(req.body)
		.then((item) => {
			res.status(201).json(item);
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end.', error });
		});
});

//populate dropdown menus on clientside
router.get(
	'/menus',
	catchAsync(async (req, res) => {
		const menus = [
			ItemsInfo.findAllColors(),
			ItemsInfo.findAllMaterials(),
			ItemsInfo.findAllGarmentTitles()
		];
		// eslint-disable-next-line prettier/prettier
		const [colors, materials, garment_titles] = await Promise.all(menus);
		return res.status(200).json({
			colors,
			materials,
			garment_titles
		});
	})
);

//get item colors by item_id
router.get('/colors/:item_id', (req, res) => {
	const item_id = req.params.item_id;

	ItemsInfo.findColorsByItemId(item_id)
		.then((item_colors) => {
			if (item_colors.length > 0) {
				const colors_list = item_colors.map((color) => color.color);
				res
					.status(200)
					.json({ item_id: item_id, colors: colors_list });
			} else {
				res.status(404).json({
					message:
						'No colors have been added for this item. Error on client end.'
				});
			}
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end.', error });
		});
});

module.exports = router;
