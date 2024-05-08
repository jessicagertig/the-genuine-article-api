exports.up = async function (knex) {
  // Drop the existing trigger
  await knex.raw(`
    DROP TRIGGER tsvectorupdate ON items;
  `);

  // Create the new function
  await knex.raw(`
    CREATE OR REPLACE FUNCTION items_search_vector_update() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector :=
        to_tsvector('pg_catalog.english', coalesce(NEW.garment_title,'') || ' ' || coalesce(cast(NEW.decade as text),'') || ' ' || coalesce(NEW.culture_country,'') || ' ' || coalesce(NEW.collection,'') || ' ' || coalesce(NEW.creator,'') || ' ' || coalesce(NEW.description,''));
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;
  `);

  // Create the new trigger
  await knex.raw(`
    CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON items FOR EACH ROW EXECUTE PROCEDURE items_search_vector_update();
  `);

  // Update existing rows
  await knex.raw(`
    UPDATE items
    SET search_vector = to_tsvector('pg_catalog.english', coalesce(garment_title,'') || ' ' || coalesce(cast(decade as text),'') || ' ' || coalesce(culture_country,'') || ' ' || coalesce(collection,'') || ' ' || coalesce(creator,'') || ' ' || coalesce(description,''));
  `);
};

exports.down = async function (knex) {
  // Drop the new trigger
  await knex.raw(`
    DROP TRIGGER tsvectorupdate ON items;
  `);

  // Re-create the old trigger
  await knex.raw(`
    CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON items FOR EACH ROW EXECUTE PROCEDURE
    tsvector_update_trigger(
      search_vector, 'pg_catalog.english', garment_title, decade, culture_country, collection, creator, description
    );
  `);

  // Revert existing rows to old format
  await knex.raw(`
    UPDATE items
    SET search_vector = to_tsvector('pg_catalog.english', garment_title || ' ' || cast(decade as text) || ' ' || culture_country || ' ' || collection || ' ' || creator || ' ' || description);
  `);
};
