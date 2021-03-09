/* eslint-disable prettier/prettier */
const router = require('express').Router();
const { checkForDuplicateItem } = require('./items-info-middleware');
const ItemsInfo = require('./items-info-model');

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

// post item-info, return item info incluing newly created id
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
