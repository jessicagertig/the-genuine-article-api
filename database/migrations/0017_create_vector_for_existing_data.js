exports.up = async function (knex) {
  await knex.raw(`
    UPDATE items SET search_vector = to_tsvector('english', garment_title || ' ' || decade || ' ' || culture_country || ' ' || collection || ' ' || creator || ' ' || description);
  `);
};

exports.down = async function (knex) {
  // There's no easy way to undo an UPDATE statement, so we leave the down function empty
};
