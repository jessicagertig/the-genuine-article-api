const router = require('express').Router()
const {
  checkForDuplicateMaterials
} = require('./item-materials-validation')
const Materials = require('./items-materials-model')

//post item-materials
router.post(
  '/:item_id',
  checkForDuplicateMaterials,
  async (req, res) => {
    const item_id = req.params.item_id
    console.log('req.body', req.body.fields)
    Materials.addItemMaterials(item_id, req.body.fields)
      .then((item) => {
        res.status(201).json(item)
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end posting materials for item with id ${item_id}.`,
          error
        })
      })
  }
)

//get item materials by item_id
router.get('/:item_id', (req, res) => {
  const item_id = req.params.item_id

  Materials.findMaterialsByItemId(item_id)
    .then((item_materials) => {
      const item_id = item_materials[0].item_id
      if (item_materials) {
        item_materials.forEach((material) => {
          delete material['item_id']
        })
        res
          .status(200)
          .json({ item_id: item_id, materials: item_materials })
      } else {
        res.status(400).json({
          message: `No materials have been added for item with id ${item_id}. Error on client end.`
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error on server end getting materials for item with id ${item_id}.`,
        error
      })
    })
})

//get items by material_id
router.get('/material/:material_id', (req, res) => {
  const material_id = req.params.material_id

  Materials.findItemsByMaterialId(material_id)
    .then((items) => {
      if (items.length > 0) {
        res.status(200).json(items)
      } else {
        res.status(400).json({
          message: `No items exist which list the material with id ${material_id}. Error on client end.`
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error on server end getting all items listing the material with id ${material_id}.`,
        error
      })
    })
})

//delete material from item's material list by material_id and item_id
router.delete('/:item_id', (req, res) => {
  const item_id = req.params.item_id
  const material_id = req.body.material_id

  Materials.removeItemMaterial(item_id, material_id)
    .then((item_material) => {
      console.log('item_material', item_material)
      if (item_material.length > 0) {
        res.status(200).json({
          message: `Material with id ${material_id} deleted from record of garment with id ${item_id}.`
        })
      } else {
        res.status(400).json({
          message: `No record with item_id ${item_id} and material_id ${material_id} exists.`
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error on server end deleting material from item with id ${item_id}.`,
        error
      })
    })
})

module.exports = router
