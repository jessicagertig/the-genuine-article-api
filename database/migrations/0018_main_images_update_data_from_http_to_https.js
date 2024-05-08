exports.up = function (knex) {
  return knex.raw(`UPDATE main_images 
                  SET main_image_url = REPLACE(main_image_url, 'http', 'https'),
                      large_url = REPLACE(large_url, 'http', 'https'),
                      display_url = REPLACE(display_url, 'http', 'https'),
                      thumb_url = REPLACE(thumb_url, 'http', 'https')`);
};

exports.down = function (knex) {
  return knex.raw(`UPDATE main_images 
                  SET main_image_url = REPLACE(main_image_url, 'https', 'http'),
                      large_url = REPLACE(large_url, 'https', 'http'),
                      display_url = REPLACE(display_url, 'https', 'http'),
                      thumb_url = REPLACE(thumb_url, 'https', 'http')`);
};
