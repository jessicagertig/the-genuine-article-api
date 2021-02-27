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

//populate dropdown menus on clientside
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

//get item materials by item_id
router.get('/materials/:item_id', (req, res) => {
	const item_id = req.params.item_id;

	ItemsInfo.findMaterialsByItemId(item_id)
		.then((item_materials) => {
			if (item_materials.length > 0) {
				const materials_list = item_materials.map(
					(material) => material.material
				);
				res.status(200).json({
					item_id: item_id,
					materials: materials_list
				});
			} else {
				res.status(404).json({
					message: `No materials have been added for item with id ${item_id}. Error on client end.`
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error on server end getting materials for item with id ${item_id}.`,
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

//post item-colors
router.post('/colors/:item_id', async (req, res) => {
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
});

//post item-materials
router.post('/materials/:item_id', async (req, res) => {
	const item_id = req.params.item_id;
	console.log('req.body', req.body.fields);
	ItemsInfo.addItemMaterials(item_id, req.body.fields)
		.then((item) => {
			res.status(201).json(item);
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error on server end posting materials for item with id ${item_id}.`,
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

//get items by material_id
router.get('/material/:material_id', (req, res) => {
	const material_id = req.params.material_id;

	ItemsInfo.findItemsByMaterialId(material_id)
		.then((items) => {
			if (items.length > 0) {
				res.status(200).json(items);
			} else {
				res.status(400).json({
					message: `No items exist which list the material with id ${material_id}. Error on client end.`
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error on server end getting all items listing the material with id ${material_id}.`,
				error
			});
		});
});

router.delete('/color/:item_id', (req, res) => {
	const item_id = req.params.item_id;
	const color_id = req.body.color_id;

	ItemsInfo.removeItemMaterial(item_id, color_id)
		.then((item_color) => {
			console.log('item_color', item_color);
			if (item_color) {
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
