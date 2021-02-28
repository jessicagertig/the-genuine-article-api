const router = require('express').Router();
const ItemsInfo = require('./items-info-model');

//get all items
router.get('/', (req, res) => {
	ItemsInfo.find()
		.then((items) => {
			if (items.length > 0) {
				res.status(200).json(items);
			} else {
				res.status(400).json({
					message: 'There are no items listed. Error on client end.'
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: 'Error on server end getting all items.',
				error
			});
		});
});

//get menus, populate dropdown menus on clientside
router.get('/menus', (req, res) => {
	const menus = [
		ItemsInfo.findAllColors(),
		ItemsInfo.findAllMaterials(),
		ItemsInfo.findAllGarmentTitles()
	];
	// eslint-disable-next-line prettier/prettier
	Promise.all(menus)
		.catch((error) => {
			console.log('Error in retrieving menus.', error);
		})
		.then((menus) => {
			const [colors, materials, garment_titles] = menus;
			res.status(200).json({
				colors,
				materials,
				garment_titles
			});
		});
});

//get item by item_id
router.get('/:item_id', (req, res) => {
	const item_id = req.params.item_id;

	ItemsInfo.findByItemId(item_id)
		.then((item) => {
			if (item) {
				res.status(200).json(item);
			} else {
				res.status(400).json({
					message: `No item with id ${item_id} exists. Error on client end.`
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error on server end getting item by id ${item_id}.`,
				error
			});
		});
});

//post item-info, return item info incluing newly created id
router.post('/', async (req, res) => {
	ItemsInfo.addItemInfo(req.body)
		.then((item) => {
			res.status(201).json(item);
		})
		.catch((error) => {
			res.status(500).json({
				message: 'Error on server end posting a new item.',
				error
			});
		});
});

module.exports = router;
