const Items = require('./items-model');
const db = require('../../database/db-config');
const { withTransaction } = require('../utils/withTransaction');

module.exports = {
  getGarmentOfTheDay,
  dailyGarmentJob
};

async function selectGarmentOfTheDay(excluded_ids) {
  const totalRecords = await db('items').count();
  let selectedRecord;
  while (!selectedRecord.length) {
    const randomIndex = Math.floor(
      Math.random() * totalRecords[0].count
    );
    console.log('RANDOM_INDEX', randomIndex);
    selectedRecord = await db('items')
      .whereNotIn('id', excluded_ids)
      .offset(randomIndex)
      .limit(1);
  }
  return selectedRecord[0];
}

async function replace_oldest_daily_item(item_id) {
  return withTransaction(async (trx) => {
    const oldestRecord = await db('garment_of_the_day')
      .orderBy('updated_at')
      .limit(1)
      .forUpdate()
      .first()
      .transacting(trx);

    if (oldestRecord) {
      await db('garment_of_the_day')
        .where('id', oldestRecord.id)
        .update({
          item_id: item_id,
          updated_at: db.fn.now()
        })
        .transacting(trx);
    }
  });
}

async function rows_count() {
  const existing_records = await db('garment_of_the_day')
    .count('id')
    .whereNotNull('item_id');

  const records_maxed = existing_records >= 7;
  return records_maxed;
}

async function getExcludedIds() {
  const existing_ids = await db('garment_of_the_day')
    .whereNotNull('item_id')
    .select('item_id');
  console.log('EXISTING IDS', existing_ids);
  const excluded_ids = existing_ids.map((record) => record.item_id);

  return excluded_ids;
}

async function dailyGarmentJob() {
  try {
    const excludedIds = await getExcludedIds();
    const newRecord = await selectGarmentOfTheDay(excludedIds);
    console.log('New record selected:', newRecord);

    const recordsMaxed = await rows_count();
    if (recordsMaxed) {
      await replace_oldest_daily_item(newRecord.id);
    } else {
      await db('garment_of_the_day').insert({
        item_id: newRecord.id
      });
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
}

async function getGarmentOfTheDay() {
  try {
    const mostRecentRecord = await db('garment_of_the_day')
      .orderBy('updated_at', 'desc')
      .limit(1)
      .first('item_id');

    const item_id = mostRecentRecord.item_id;

    const garment_of_the_day = await Items.findItemById(item_id);

    return garment_of_the_day;
  } catch (error) {
    console.error(
      `An error occurred while getting the item of the day from the DB. Error: ${error}`
    );
    throw error;
  }
}
