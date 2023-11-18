exports.up = function (knex) {
  return knex('main_images').update({ small_url: null });
};

exports.down = function (knex) {
  //nothing to do here
};
