// Links seeded garments to materials. Keys are item_collection_no values and
// values are material names from the materials seed. Ids are looked up by
// name so this file does not depend on the order rows were inserted in.
// Every garment only gets materials its own description states.
const garmentMaterials = {
  '2009.5.6': ['linen', 'cotton'],
  '2009.5.36': ['cotton'],
  '1996-164-1a,b': ['silk brocade'],
  '2009.5.66': ['silk', 'cotton'],
  '1986.1220a-b': ['silk'],
  '84.5.2A-C': ['cotton'],
  '1992-32-2': ['wool'],
  'S83.530.1AB': ['wool', 'silk', 'cotton'],
  '2007.893.1AB': ['silk brocade', 'silk'],
  '1989.40a-d': ['silk'],
  '2017.5.47A-E': ['silk', 'satin', 'cotton'],
  '94.661.1A-D': ['silk', 'satin'],
  '1988.222': ['silk', 'linen'],
  '2003.127': ['silk', 'pearls'],
  '1927.331': ['cotton', 'silk'],
  '1989.347': ['cotton'],
  'AC312 77-12-27': ['silk', 'satin'],
  'T.151 to B-1968': ['cotton'],
  '1969-102-1a,b': ['silk'],
  'AC4844 1984-18-4AB': ['wool'],
  '2011-117-1a--f': ['silk', 'satin'],
  'C.I.68.53.5a–h': ['wool'],
  '2015.688.a-b': ['silk', 'satin'],
  'AC3887 82-25-3AB': ['wool']
};

exports.seed = async function (knex) {
  const items = await knex('items').select('id', 'item_collection_no');
  const materials = await knex('materials').select('id', 'material');
  const itemIds = new Map(items.map((i) => [i.item_collection_no, i.id]));
  const materialIds = new Map(materials.map((m) => [m.material, m.id]));

  const rows = [];
  for (const [collectionNo, names] of Object.entries(garmentMaterials)) {
    if (!itemIds.has(collectionNo)) {
      throw new Error(`No seeded item with collection no. ${collectionNo}`);
    }
    for (const name of names) {
      if (!materialIds.has(name)) {
        throw new Error(`No seeded material named ${name}`);
      }
      rows.push({
        item_id: itemIds.get(collectionNo),
        material_id: materialIds.get(name)
      });
    }
  }

  return knex('item_materials').insert(rows);
};
