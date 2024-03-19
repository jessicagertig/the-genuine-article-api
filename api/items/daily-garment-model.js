const Items = require('./items-model');
const db = require('../../database/db-config');
const { withTransaction } = require('../utils/withTransaction');

module.exports = {
  getGarmentOfTheDay,
  dailyGarmentJob,
  deleteGarmentOfTheDay
};
// called second in daily garment job
// needs to know excluded ids before being called
async function selectGarmentOfTheDay(excluded_ids) {
  const totalRecords = await db('items').count();
  const totalRecordsCount = parseInt(totalRecords[0].count);
  let selectedRecord = [];
  while (selectedRecord.length === 0) {
    const randomIndex = Math.floor(
      Math.random() * totalRecordsCount
    );
    console.log('RANDOM_INDEX', randomIndex);
    selectedRecord = await db('items')
      .whereNotIn('id', excluded_ids)
      .offset(randomIndex)
      .limit(1);
  }
  return selectedRecord[0];
}
// If the table has returns true for records_maxed in daily Garment Job
// Call this function to replace the oldest record
async function replace_oldest_daily_item(item_id) {
  return withTransaction(async (trx) => {
    const oldestRecord = await db('garment_of_the_day')
      .orderBy('updated_at')
      .limit(1)
      .forUpdate()
      .first()
      .transacting(trx);

    if (oldestRecord) {
      const affectedRows = await db('garment_of_the_day')
        .where('id', oldestRecord.id)
        .update({
          item_id: item_id,
          updated_at: db.fn.now()
        })
        .transacting(trx);

      if (affectedRows === 0) {
        console.error('Update operation failed:', oldestRecord.id);
      }
    }
  });
}
// Returns true if 14 or more rows exist
// This is used in a function to ensure that for 14 days no duplicate will be selected
// In future this may be a month or a year in length
async function rows_count() {
  const existing_records = await db('garment_of_the_day')
    .count('id')
    .whereNotNull('item_id');

  const total_records_count = parseInt(existing_records[0].count);
  const records_maxed = total_records_count >= 14;
  console.log('records_maxed?', records_maxed);

  return records_maxed;
}
// called first in dailyGarmentJob
// returns ids that should be excluded from selection
async function getExcludedIds() {
  const existing_ids = await db('garment_of_the_day')
    .whereNotNull('item_id')
    .select('item_id');
  console.log('EXISTING IDS', existing_ids);
  const excluded_ids = existing_ids.map((record) => record.item_id);

  return excluded_ids;
}
// Main function
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
    console.log('Most recent record:', mostRecentRecord);
    if (mostRecentRecord !== undefined) {
      const item_id = mostRecentRecord.item_id;
      const garment_of_the_day = await Items.findItemById(item_id);
      return garment_of_the_day;
    } else {
      console.error(
        'The most recent record query returned undefined.'
      );
      throw new Error(
        'The most recent record query returned undefined.'
      );
    }
  } catch (error) {
    console.error(
      `An error occurred while getting the item of the day from the DB. ${error}`
    );
    throw error;
  }
}
// used in the delete_item funciont
// so this records is not orphaned, should consider a cascade instead
async function deleteGarmentOfTheDay(item_id, context = {}) {
  const { trx } = context;
  try {
    await db('garment_of_the_day')
      .where('item_id', item_id)
      .del()
      .transacting(trx);
  } catch (error) {
    console.error(
      `Error deleting garment of the day for item_id: ${item_id}`,
      {
        error: error.message,
        itemId: item_id
      }
    );
  }
}
