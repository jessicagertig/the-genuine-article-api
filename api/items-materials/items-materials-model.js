const db = require('../../database/db-config');

module.exports = {
  findAllMaterials,
  findMaterialsByItemId,
  findItemsByMaterialId,
  addItemMaterials,
  removeItemMaterial,
  editItemMaterials
};

//find materials for dropdown menus (forms and searchs)
function findAllMaterials() {
  return db('materials').select('*');
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

//put item-materials with item_id --> for editing materials after initial entry
function addItemMaterials(item_id, material_fields) {
  //material_fields should be an object containing an array of objects named fields (json format)
  //such as { 'fields': [{'id': 2, 'material': 'red'}, {'id': 6, 'material': turquoise}] }
  const fieldsToInsert = material_fields.map((material_field) => ({
    item_id: item_id,
    material_id: material_field.id //how is this data going to come from frontend?
  }));
  //fieldsToInsert needs to be an array of objects, via knex, postgresql will then insert each object as separate row
  return db('item_materials').insert(fieldsToInsert).returning('*');
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
