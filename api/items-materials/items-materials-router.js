const router = require('express').Router();
const {
	checkForDuplicateMaterials
} = require('./item-materials-validation');
const ItemsMaterials = require('./items-materials-model');

//post item-materials
router.post(
	'/:item_id',
	checkForDuplicateMaterials,
	async (req, res) => {
		const item_id = req.params.item_id;
		console.log('req.body', req.body.fields);
		ItemsMaterials.addItemMaterials(item_id, req.body.fields)
			.then((item) => {
				res.status(201).json(item);
			})
			.catch((error) => {
				res.status(500).json({
					message: `Error on server end posting materials for item with id ${item_id}.`,
					error
				});
			});
	}
);

//get item materials by item_id
router.get('/:item_id', (req, res) => {
	const item_id = req.params.item_id;

	ItemsMaterials.findMaterialsByItemId(item_id)
		.then((item_materials) => {
			console.log('item materials', item_materials);
			if (item_materials.length > 0) {
				let materials_dict = {};
				for (let i = 0; i < item_materials.length; i++) {
					// eslint-disable-next-line prettier/prettier
				materials_dict[item_materials[i].material] = item_materials[i].material_id;
				}
				res
					.status(200)
					.json({ item_id: item_id, materials: materials_dict });
			} else {
				res.status(400).json({
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

//get items by material_id
router.get('/material/:material_id', (req, res) => {
	const material_id = req.params.material_id;

	ItemsMaterials.findItemsByMaterialId(material_id)
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

//delete material from item's material list by material_id and item_id
router.delete('/:item_id', (req, res) => {
	const item_id = req.params.item_id;
	const material_id = req.body.material_id;

	ItemsMaterials.removeItemMaterial(item_id, material_id)
		.then((item_material) => {
			console.log('item_material', item_material);
			if (item_material.length > 0) {
				res.status(200).json({
					message: `Material with id ${material_id} deleted from record of garment with id ${item_id}.`
				});
			} else {
				res.status(400).json({
					message: `No record with item_id ${item_id} and material_id ${material_id} exists.`
				});
			}
		})
		.catch((error) => {
			res.status(500).json({
				message: `Error on server end deleting material from item with id ${item_id}.`,
				error
			});
		});
});

module.exports = router;
