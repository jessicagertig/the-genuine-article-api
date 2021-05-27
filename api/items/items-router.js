const router = require('express').Router()
const Colors = require('../items-colors/items-colors-model')
const Materials = require('../items-materials/items-materials-model')
const Items = require('./items-model')

//Get all items, in this case must find colors and materials for each item and add to list
router.get('/', async (req, res) => {
  try {
    const result = await Items.getAllItems()
    if (result) {
      res.status(200).json(result)
    } else {
      res.status(400).json({
        message: 'There are no items listed. Error on client end.'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error on server end getting all items.',
      error
    })
  }
})

//get menus, populate dropdown menus on clientside
//function must come before get by item_id else pg will try to insert 'menus' as id
router.get('/menus', async (req, res) => {
  try {
    const color_menu = await Colors.findAllColors()
    const materials_menu = await Materials.findAllMaterials()
    const garment_titles_menu = await Items.findAllGarmentTitles()
    if (!color_menu) {
      throw 'Error fetching the color menu.'
    }
    if (!materials_menu) {
      throw 'Error fetching the materials menu.'
    }
    if (!garment_titles_menu) {
      throw 'Error fetching the garment titles menu.'
    }
    const menus = {
      color_menu: color_menu,
      materials_menu: materials_menu,
      garment_titles_menu: garment_titles_menu
    }
    return res.status(200).json(menus)
  } catch (error) {
    return res
      .status(500)
      .json({ Message: 'Error fetching menus.', error })
  }
})

//get item by item id
router.get('/:item_id', async (req, res) => {
  const item_id = req.params.item_id

  try {
    const item = await Items.findItemById(item_id)

    return res.status(200).json(item)
  } catch (error) {
    res.status(500).json({
      Message: `Error retriveing item with id ${item_id}.`,
      error
    })
  }
})

//post an item
router.post('/', async (req, res) => {
  try {
    const newItem = await Items.createItem(
      req.body.item_info,
      req.body.item_colors,
      req.body.item_materials
    )
    return res.status(201).json(newItem)
  } catch (error) {
    return res
      .status(500)
      .json({ Message: 'Error creating new item.', error })
  }
})

module.exports = router
