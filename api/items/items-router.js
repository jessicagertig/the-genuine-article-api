/* eslint-disable prettier/prettier */
const router = require('express').Router();
// const { checkForDuplicateItem } = require('./items-info-middleware');
const Items = require('./items-model');
const ItemsInfo = require('../items-info/items-info-model');
const Colors = require('../items-colors/items-colors-model');
const Materials = require('../items-materials/items-materials-model');

//work in progress -> attempting to filter out any items that do not include a color and a material?
router.get('/', async (req, res) => {
  try {
    const item_info = await ItemsInfo.find();
    let result = [];
    if (item_info) {
      for (let i = 0; i < item_info.length; i++) {
        //iterate over each item found
        let item = item_info[i];
        //create list of colors
        let colors = await Colors.findColorsByItemId(item_info[i].id);
        if (colors.length > 0) {
          colors = colors.map((color) => color.color);
          //add list to item object
          item['colors'] = colors;
        } else {
          res
            .status(400)
            .json({ message: 'The record is incomplete.  No colors are listed' });
          break;
        }
        //create list of materials
        let materials = await Materials.findMaterialsByItemId(item_info[i].id);
        if (materials.length > 0) {
          materials = materials.map((material) => material.material);
          //add list to item object
          item['materials'] = materials;
        } else {
          res
            .status(400)
            .json({  message: 'The record is incomplete.  No materials are listed' });
          break;
        }
        result.push(item);
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

//get item by item id
router.get('/:item_id', async (req, res) => {
  const item_id = req.params.item_id;
  
  try {
    const item = await Items.findItemById(item_id);

    return res.status(200).json(item)
  } catch (error) {
    res
    .status(500)
    .json({ Message: `Error retriveing item with id ${item_id}.`, error });
  }
})

//get menus, populate dropdown menus on clientside
//deal properly with error handling?  Are menu sizes worth using async?
//NOT WORKING 
router.get('/menus', (req, res) => {
  try {
    const menus = [
      Items.findAllColors(),
      Items.findAllMaterials(),
      Items.findAllGarmentTitles()
    ];
    // eslint-disable-next-line prettier/prettier
    Promise.all(menus)
      .then((menus) => {
        const [colors, materials, garment_titles] = menus;
        res.status(200).json({
          colors,
          materials,
          garment_titles
        });
      });
  } catch (error) {
    console.log("Error", error)
  }
});

//post an item
router.post('/', async (req, res) => {
  try {
    const newItem = await Items.createItem(
      req.body.item_info,
      req.body.item_colors,
      req.body.item_materials
    );
    return res.status(201).json(newItem);
  } catch (error) {
    return res
      .status(500)
      .json({ Message: 'Error creating new item.', error });
  }
});

module.exports = router;
