exports.up = async function (knex) {
  await knex.schema.table('items', function (tbl) {
    tbl.specificType('search_vector', 'tsvector');
  });

  await knex.raw(`
    CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON items FOR EACH ROW EXECUTE PROCEDURE
    tsvector_update_trigger(
      search_vector, 'pg_catalog.english', garment_title, decade, culture_country, collection, creator, description
    );
  `);

  await knex.raw(`
    CREATE INDEX search_vector_index ON items USING gin(search_vector);
  `);
};

exports.down = async function (knex) {
  await knex.schema.table('items', function (tbl) {
    tbl.dropColumn('search_vector');
  });

  await knex.raw(`
    DROP INDEX search_vector_index;
  `);
};
