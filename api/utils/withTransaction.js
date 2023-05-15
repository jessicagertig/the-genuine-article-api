const db = require('../../database/db-config');

async function withTransaction(callback) {
  const trx = await db.transaction();
  try {
    const result = await callback(trx);
    await trx.commit();
    return result;
  } catch (e) {
    await trx.rollback();
    console.error(e);
    throw e;
  }
}

module.exports = {
  withTransaction
};
