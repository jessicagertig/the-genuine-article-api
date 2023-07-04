const db = require('../../database/db-config');

module.exports = {
  findAllColors,
  findColorsByItemId,
  findItemsByColorId,
  insertItemColors,
  removeItemColor,
  editItemColors
};

//find all colors
function findAllColors() {
  return db('colors').select('*');
}

//findColorsByItemId
function findColorsByItemId(item_id) {
  return db('item_colors as ic')
    .select('ic.color_id', 'colors.color')
    .join('colors', 'ic.color_id', 'colors.id')
    .where('item_id', item_id);
}

//findItemsByColorId
// only function to be used in items-colors-router.js - for base of search results
function findItemsByColorId(color_id) {
  return db('item_colors as ic')
    .join('colors', 'ic.color_id', 'colors.id')
    .join('items', 'ic.item_id', 'items.id')
    .select(
      'ic.item_id',
      'ic.color_id',
      'colors.color',
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
    .where('color_id', color_id);
}

//For editing Item colors after initial entry
function insertItemColors(item_id, color_fields) {
  //color_fields should be an object containing an array of objects named fields (json format)
  //such as { 'fields': [{'id': 2, 'color': 'red'}, {'id': 6, 'color': turquoise}] }
  const fieldsToInsert = color_fields.map((color_field) => ({
    item_id: item_id,
    color_id: color_field.id //how is this data going to come from frontend?
  }));
  //fieldsToInsert needs to be an array of objects, via knex, postgresql will then insert each object as separate row
  return db('item_colors').insert(fieldsToInsert).returning('*');
}

//Delete Item_Color --> for editing item colors after initial entry
function removeItemColor(item_id, color_id) {
  return db('item_colors')
    .where({ item_id })
    .andWhere({ color_id })
    .del(['item_id', 'color_id']);
}

//Edit Item_Colors --> for editing item colors after initial entry - will delete all item_colors for item_id and insert new ones or none
async function editItemColors(item_id, colors_array, context = {}) {
  const { trx } = context;
  let item_colors;
  // if item_colors is undefined, we are not editing colors,
  // so return all existing item_colors for item_id
  if (colors_array === undefined) {
    item_colors = await findItemsByColorId(item_id);
  } else {
    //delete all item_colors for item_id
    await db('item_colors')
      .where({ item_id })
      .del()
      .transacting(trx);

    //insert new item_colors for item_id
    if (colors_array.length === 0) {
      return [];
    } else {
      const fieldsToInsert = colors_array.map((color_id) => ({
        item_id: item_id,
        color_id: color_id
      }));
      item_colors = await db('item_colors')
        .insert(fieldsToInsert)
        .transacting(trx)
        .returning('*');
    }
  }
  return item_colors;
}
