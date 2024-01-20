const db = require('../../database/db-config');

module.exports = {
  findAllColors,
  findColorsByItemId,
  findItemsByColorId,
  addItemColors,
  removeItemColor,
  editItemColors,
  deleteItemColors,
  findColorByName,
  addColor,
  editColor,
  deleteColor
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

async function findColorByName(color) {
  // if (typeof color === 'string') {
  //   console.log("It's a string.");
  // }
  const result = await db('colors')
    .select('*')
    .where('color', color);
  return result[0];
}

async function addColor(color) {
  const new_color = color.toLowerCase();
  return db('colors').insert({ color: new_color }).returning('*');
}

async function editColor(color, color_id) {
  const new_color = color.toLowerCase();

  const edited_color = await db('colors')
    .where('id', color_id)
    .first({})
    .update({ color: new_color })
    .returning('*');
  console.log(
    '\x1b[35m',
    '[editColor Function] Edited color:',
    edited_color,
    '\x1b[0m'
  );

  return edited_color;
}

async function deleteColor(color_id) {
  const allowed = await findItemsByColorId(color_id);
  console.log('allowed', allowed);
  if (allowed.length === 0) {
    return db('colors').where({ id: color_id }).del().returning('*');
  } else {
    throw new Error(
      'Cannot delete color while associated with items.'
    );
  }
}

async function addItemColors(item_id, colors_array, context = {}) {
  const { trx } = context;
  let color_ids = [];

  //insert new item_colors for item_id
  if (colors_array.length > 0) {
    const fieldsToInsert = colors_array.map((color_id) => ({
      item_id: item_id,
      color_id: color_id
    }));
    const item_colors = await db('item_colors')
      .insert(fieldsToInsert)
      .transacting(trx)
      .returning(['item_id', 'color_id']);

    // define color_ids for return
    color_ids = item_colors.map((color) => color.color_id);
  }

  return color_ids;
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

async function deleteItemColors(item_id, context = {}) {
  const { trx } = context;
  await db('item_colors').where({ item_id }).del().transacting(trx);
}
