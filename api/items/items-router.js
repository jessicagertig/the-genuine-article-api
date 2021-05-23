/* eslint-disable prettier/prettier */
const router = require('express').Router();
// const { checkForDuplicateItem } = require('./items-info-middleware');
const Items = require('./items-model');
const ItemsInfo = require('../items-info/items-info-model');

//work in progress -> attempting to filter out any items that do not include a color and a material?
router.get('/', async (req, res) => {
  try {
    const item_info = await ItemsInfo.find();
    console.log(item_info)
    let result = {}
    let itemsList = []
    let itemsNeedingColors = []
    let itemsNeedingMaterials = []
    if (item_info) {
      for (let i = 0; i < item_info.length; i++) {
        //iterate over each item found
        let item = item_info[i];
        //create list of colors
        let colors = await Items.findColorsByItemId(item.id);
        if (colors.length > 0) {
          colors = colors.map((color) => color.color);
          //add list to item object
          item['colors'] = colors;
        } else {
          item['colors'] = []
          itemsNeedingColors.push(item.id)
        }
        //create list of materials
        let materials = await Items.findMaterialsByItemId(item_info[i].id);
        if (materials.length > 0) {
          materials = materials.map((material) => material.material);
          //add list to item object
          item['materials'] = materials;
        } else {
          item['materials'] = []
          itemsNeedingMaterials.push(item.id)
        }
        itemsList.push(item);
      }
      result['items_list'] = itemsList
      result['items_without_colors'] = itemsNeedingColors
      result['items_without_materials'] = itemsNeedingMaterials
      res.status(200).json(result)
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
//function must come before get by item_id else pg will try to insert 'menus' as id
router.get('/menus', async (req, res) => {
  try {
    const color_menu = await Items.findAllColors()
    const materials_menu = await Items.findAllMaterials()
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
    return res
      .status(200)
      .json(menus)
    // const menus = [
      //   Items.findAllColors(),
      //   Items.findAllMaterials(),
      //   Items.findAllGarmentTitles()
      // ];
      // Promise.all(menus)
      //   .then((menus) => {
        //     const [colors, materials, garment_titles] = menus;
        //     res.status(200).json({
          //       colors,
          //       materials,
          //       garment_titles
          //     });
          //   });
  } catch (error) {
    return res
    .status(500)
    .json({ Message: 'Error fetching menus.', error });
  }
})
      
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
