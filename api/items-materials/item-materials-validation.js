const Items = require('../items/items-model');
const Materials = require('./items-materials-model');

const checkForDuplicateMaterials = async (req, res, next) => {
  const item_id = req.params.item_id;
  let duplicate = false;
  const currentMaterials = await Items.findMaterialsByItemId(
    item_id
  );

  if (currentMaterials.length > 0) {
    const material_ids = currentMaterials.map(
      (item) => item.material_id
    );
    let ids_set = new Set(material_ids);
    let incoming = req.body.fields;
    for (let i = 0; i < incoming.length; i++) {
      if (ids_set.has(incoming[i].id) === true) {
        duplicate = true;
        res.status(400).json({
          message: `Duplicate material. Please remove the material ${incoming[i].material} and try again.`
        });
        break;
      }
    }
    if (duplicate === false) {
      next();
    }
  } else {
    next();
  }
};

const checkForDuplicateMaterialOptions = async (req, res, next) => {
  const material = req.body.material_option;
  const existing_material = await Materials.findMaterialByName(
    material
  );

  if (existing_material !== undefined) {
    res.status(400).json({
      message: `Duplicate material option. A material (id ${
        existing_material.id
      }) with name ${material.toUpperCase()} already exists.`
    });
  } else {
    next();
  }
};

module.exports = {
  checkForDuplicateMaterials,
  checkForDuplicateMaterialOptions
};
