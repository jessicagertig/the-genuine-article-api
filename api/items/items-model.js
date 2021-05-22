const db = require('../../database/db-config')

module.exports = {
  findAllColors,
  findAllMaterials,
  findAllGarmentTitles,
  findColorsByItemId,
  findMaterialsByItemId,
  findInfoById,
  findItemById,
  createItem
}

//find colors, materials, and garment_titles for dropdown menus (forms and searchs)
function findAllColors() {
  return db('colors').select('*')
}

function findAllMaterials() {
  return db('materials').select('*')
}

function findAllGarmentTitles() {
  return db('garment_titles').select('*')
}

//findColorsByItemId
function findColorsByItemId(item_id) {
  return db('item_colors as ic')
    .select('ic.item_id', 'ic.color_id', 'colors.color')
    .join('colors', 'ic.color_id', 'colors.id')
    .where('item_id', item_id)
}

//findMaterialsByItemId
function findMaterialsByItemId(item_id) {
  return db('item_materials as im')
    .select('im.item_id', 'im.material_id', 'materials.material')
    .join('materials', 'im.material_id', 'materials.id')
    .where('item_id', item_id)
}

//findInfoById
function findInfoById(id) {
  return db('items').where({ id }).first()
}

//findItemById
async function findItemById(id) {
  const info = await findInfoById(id)
  const colors = await findColorsByItemId(id)
  const materials = await findMaterialsByItemId(id)
  console.log('info', info)
  console.log('colors', colors)
  console.log('materials', materials)
  const returned = {
    info,
    colors,
    materials
  }
  return returned
}

async function createItem(item_info, item_colors, item_materials) {
  return db.transaction((trx) => {
    return db('items')
      .insert(item_info)
      .transacting(trx)
      .returning('id')
      .then((res) => {
        console.log('ID', res[0])
        const item_id = res[0]
        const colorFieldsToInsert = item_colors.map(
          (item_color) => ({
            item_id: item_id,
            color_id: item_color.color_id, //how is this data going to come from frontend?
            color: item_color.color
          })
        )
        console.log('colors to insert', colorFieldsToInsert)
        return db('item_colors')
          .insert(colorFieldsToInsert)
          .transacting(trx)
          .returning('item_id')
      })
      .then((res) => {
        const item_id = res[0]
        const materialFieldsToInsert = item_materials.map(
          (item_material) => ({
            item_id: item_id,
            material_id: item_material.material_id, //how is this data going to come from frontend?
            material: item_material.material
          })
        )
        console.log('materials to insert', materialFieldsToInsert)
        return db('item_materials')
          .insert(materialFieldsToInsert)
          .transacting(trx) //todo try and return something better!
          .returning(item_id)
          .then((res) => {
            return res[0]
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
}
