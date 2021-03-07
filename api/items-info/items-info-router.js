/* eslint-disable prettier/prettier */
const router = require('express').Router();
const { checkForDuplicateItem } = require('./items-info-middleware');
const ItemsInfo = require('./items-info-model');
const Colors = require('../items-colors/items-colors-model');
const Materials = require('../items-materials/items-materials-model');

//get all items with basic info
router.get('/info', (req, res) => {
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

router.get('/', async (req, res) => {
	try {
		const item_info = await ItemsInfo.find();
		let result = [];
		if (item_info) {
			for (let i = 0; i < item_info.length; i++) {
				//iterate over each item found
				let info = item_info[i];
				//create list of colors
				let colors = await Colors.findColorsByItemId(item_info[i].id);
				if (colors.length > 0) {
					colors = colors.map((color) => color.color);
				} else {
					colors = false;
				}
				//create list of materials
				let materials = await Materials.findMaterialsByItemId(item_info[i].id);
				if (materials.length > 0) {
					materials = materials.map((material) => material.material);
				} else {
					materials = false;
				}
				//determine result messages based on if any colors or materials are listed, later attempt to ensure they are always listed
				if (colors && materials) {
					info['colors'] = colors;
					info['materials'] = materials;
				} else if (!colors && materials) {
					info['colors'] = 'There are no materials listed for this item.';
					info['materials'] = materials;
				} else if (colors && !materials) {
					info['colors'] = colors;
					info['materials'] = 'There are no materials listed for this item.';
				} else if (!colors && !materials) {
					info['colors'] = 'There are no colors listed for this item.';
					info['materials'] = 'There are no materials listed for this item.';
				}
				result.push(info);
			}
			res.status(200).json(result);
		} else {
			res.status(400).json({
				message: 'There are no items listed. Error on client end.'
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error on server end getting all items.',
			error
		});
	}
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
router.post('/', checkForDuplicateItem, async (req, res) => {
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

//put item-info
router.put('/:item_id', async (req, res) => {
	const item_id = req.params.item_id;
	const data = req.body;

	try {
		const item_info = await ItemsInfo.findByItemId(item_id);
		console.log('item info', item_info);
		if (item_info !== undefined) {
			const edited_item = await ItemsInfo.updateItemInfo(
				data,
				item_id
			);
			res.status(200).json(edited_item[0]);
		} else {
			res.status(400).json({
				message: `No item with id ${item_id} exists. Error on client end.`
			});
		}
	} catch (error) {
		res.status(500).json({
			message: `Error on server end updating item by id ${item_id}.`,
			error
		});
	}
});

module.exports = router;
