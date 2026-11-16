// Seeds the item_colors join table. Since the item collection number is
// unique to every item, we are using them in the test seeding to substitute
// for the normal database unique IDs.
const garmentColors = {
  '1973.65.3': ['cream'],
  '2009.5.6': ['white'],
  '2009.5.36': ['white'],
  '1996-164-1a,b': ['yellow'],
  '2009.5.66': ['orange'],
  '1986.1220a-b': ['cream'],
  '84.5.2A-C': ['pink'],
  '1992-32-2': ['navy'],
  'S83.530.1AB': ['green'],
  '2007.893.1AB': ['black'],
  '1989.40a-d': ['blue'],
  '2017.5.47A-E': ['cream', 'green'],
  '94.661.1A-D': ['black', 'green'],
  '1988.222': ['cream'],
  '2003.127': ['beige'],
  '1927.331': ['white'],
  'AC6993 91-12-14': ['pink'],
  '1963-94-1a,b': ['grey', 'blue'],
  'T.151 to B-1968': ['yellow', 'tan'],
  '2015.688.a-b': ['orange'],
  'AC3887 82-25-3AB': ['brown']
};

exports.seed = async function (knex) {
  const items = await knex('items').select('id', 'item_collection_no');
  const colors = await knex('colors').select('id', 'color');
  const itemIds = new Map(items.map((i) => [i.item_collection_no, i.id]));
  const colorIds = new Map(colors.map((c) => [c.color, c.id]));

  const rows = [];
  for (const [collectionNo, names] of Object.entries(garmentColors)) {
    if (!itemIds.has(collectionNo)) {
      throw new Error(`No seeded item with item_collection_no ${collectionNo}`);
    }
    for (const name of names) {
      if (!colorIds.has(name)) {
        throw new Error(`No seeded color named ${name}`);
      }
      rows.push({
        item_id: itemIds.get(collectionNo),
        color_id: colorIds.get(name)
      });
    }
  }

  return knex('item_colors').insert(rows);
};
