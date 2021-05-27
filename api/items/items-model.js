const db = require('../../database/db-config')
const Colors = require('../items-colors/items-colors-model')
const Materials = require('../items-materials/items-materials-model')

module.exports = {
  findAllGarmentTitles,
  getAllItems,
  findAllItemsInfo,
  findInfoById,
  findItemById,
  createItem
}

//finds all items (excluding colors and materials)
function findAllItemsInfo() {
  return db('items')
    .select(
      'id',
      'garment_title',
      'garment_type',
      'begin_year',
      'end_year',
      'decade',
      'secondary_decade',
      'culture_country',
      'collection',
      'collection_url',
      'creator',
      'source',
      'item_collection_no',
      'description'
    )
    .orderBy('id')
}

//findsAllGarmentTitles
function findAllGarmentTitles() {
  return db('garment_titles').select('*')
}

//findInfoById
function findInfoById(id) {
  return db('items').where({ id }).first()
}

//findItemById
async function findItemById(id) {
  const info = await findInfoById(id)
  const colors = await Colors.findColorsByItemId(id)
  const materials = await Materials.findMaterialsByItemId(id)
  const returned = {
    info,
    colors,
    materials
  }
  return returned
}

async function getAllItems() {
  let info = await findAllItemsInfo()
  for (let i = 0; i < info.length; i++) {
    let item = info[i]
    let item_id = item.id
    const materials = await Materials.findMaterialsByItemId(item_id)
    // eslint-disable-next-line prettier/prettier
    const materialsList = materials.map((material) => material.material)
    item['materials'] = materialsList
    let colors = await Colors.findColorsByItemId(item_id)
    const colorsList = colors.map((color) => color.color)
    item['colors'] = colorsList
  }
  return info
}

async function createItem(item_info, item_colors, item_materials) {
  return db.transaction((trx) => {
    return db('items')
      .insert(item_info)
      .transacting(trx)
      .returning('id')
      .then((res) => {
        const item_id = res[0]
        const colorFieldsToInsert = item_colors.map(
          (item_color) => ({
            item_id: item_id,
            color_id: item_color.color_id //how is this data going to come from frontend?
          })
        )
        return db('item_colors')
          .insert(colorFieldsToInsert)
          .transacting(trx)
          .returning(['item_id', 'color_id'])
      })
      .then((res) => {
        const item_id = res[0].item_id
        const color_ids = res.map((color) => color.color_id)
        const materialFieldsToInsert = item_materials.map(
          (item_material) => ({
            item_id: item_id,
            material_id: item_material.material_id //how is this data going to come from frontend?
          })
        )
        return db('item_materials')
          .insert(materialFieldsToInsert)
          .transacting(trx)
          .returning(item_id)
          .then((res) => {
            const item = {
              item_id: res[0],
              item_info: item_info,
              color_ids: color_ids,
              material_ids: materialFieldsToInsert.map(
                (material) => material.material_id
              )
            }
            return item
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
}
