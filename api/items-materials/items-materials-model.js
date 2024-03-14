const db = require('../../database/db-config');

module.exports = {
  findAllMaterials,
  findMaterialsByItemId,
  findItemsByMaterialId,
  addItemMaterials,
  removeItemMaterial,
  editItemMaterials,
  deleteItemMaterials,
  findMaterialByName,
  addMaterial,
  editMaterial,
  deleteMaterial
};

//find materials for dropdown menus (forms and searchs)
function findAllMaterials() {
  return db('materials').select('*').orderBy('material', 'asc');
}

//findMaterialsByItemId
function findMaterialsByItemId(item_id) {
  return db('item_materials as im')
    .select('im.material_id', 'materials.material')
    .join('materials', 'im.material_id', 'materials.id')
    .where('item_id', item_id);
}

//findItemsByMaterialId
function findItemsByMaterialId(material_id) {
  return db('item_materials as im')
    .join('materials', 'im.material_id', 'materials.id')
    .join('items', 'im.item_id', 'items.id')
    .select(
      'im.item_id',
      'im.material_id',
      'materials.material',
      'items.garment_title',
      'items.garment_type',
      'items.begin_year',
      'items.end_year',
      'items.decade',
      'items.secondary_decade',
      'items.culture_country',
      'items.collection',
      'items.collection_url',
      'items.creator',
      'items.source',
      'items.item_collection_no',
      'items.description'
    )
    .where('material_id', material_id);
}

async function findMaterialByName(material) {
  const lookup_material = material && material.toLowerCase();
  const result = await db('materials')
    .select('*')
    .where('material', lookup_material);
  return result[0];
}

async function addMaterial(material) {
  const new_material = material.toLowerCase();
  return db('materials')
    .insert({ material: new_material })
    .returning('*');
}

async function editMaterial(material, material_id) {
  const new_material = material.toLowerCase();

  const edited_material = await db('materials')
    .where('id', material_id)
    .first({})
    .update({ material: new_material })
    .returning('*');
  console.log(
    '\x1b[35m',
    '[editMaterial Function] Edited material:',
    edited_material,
    '\x1b[0m'
  );

  return edited_material;
}

async function deleteMaterial(material_id) {
  const allowed = await findItemsByMaterialId(material_id);
  console.log('allowed', allowed);
  if (allowed.length === 0) {
    return db('materials')
      .where({ id: material_id })
      .del()
      .returning('*');
  } else {
    throw new Error(
      'Cannot delete material while associated with items.'
    );
  }
}

async function addItemMaterials(
  item_id,
  materials_array,
  context = {}
) {
  const { trx } = context;
  let material_ids = [];

  //insert new item_materials for item_id
  if (materials_array.length > 0) {
    const fieldsToInsert = materials_array.map((material_id) => ({
      item_id: item_id,
      material_id: material_id
    }));
    const item_materials = await db('item_materials')
      .insert(fieldsToInsert)
      .transacting(trx)
      .returning(['item_id', 'material_id']);

    // define material_ids for return
    material_ids = item_materials.map(
      (material) => material.material_id
    );
  }

  return material_ids;
}

//Delete Item_Material --> for editing item materials after initial post
function removeItemMaterial(item_id, material_id) {
  return db('item_materials')
    .where({ item_id })
    .andWhere({ material_id })
    .del(['item_id', 'material_id']);
}

//Edit Item_Materials --> for editing item materials after initial entry - will delete all item_materials for item_id and insert new ones or none
async function editItemMaterials(
  item_id,
  materials_array,
  context = {}
) {
  const { trx } = context;
  let item_materials;
  // if item_materials is undefined, we are not editing materials,
  // so return all existing item_materials for item_id
  // TODO: consider sending null instead of undefined
  if (materials_array === undefined) {
    item_materials = await findItemsByMaterialId(item_id);
  } else {
    //delete all item_materials for item_id
    await db('item_materials')
      .where({ item_id })
      .del()
      .transacting(trx);

    //insert new item_materials for item_id
    if (materials_array.length === 0) {
      return [];
    } else {
      const fieldsToInsert = materials_array.map((material_id) => ({
        item_id: item_id,
        material_id: material_id
      }));
      item_materials = await db('item_materials')
        .insert(fieldsToInsert)
        .transacting(trx)
        .returning('*');
    }
  }
  return item_materials;
}

async function deleteItemMaterials(item_id, context = {}) {
  const { trx } = context;
  await db('item_materials')
    .where({ item_id })
    .del()
    .transacting(trx);
}
