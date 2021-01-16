exports.seed = function (knex) {
  // Inserts seed entries
  return knex('colors').insert([
    {
      color: 'black',
    },
    {
      color: 'white',
    },
    {
      color: 'beige',
    },
    {
      color: 'tan',
    },
    {
      color: 'grey',
    },
    {
      color: 'silver',
    },
    {
      color: 'orange',
    },
    {
      color: 'red',
    },
    {
      color: 'maroon',
    },
    {
      color: 'purple',
    },
    {
      color: 'lavender',
    },
    {
      color: 'fuchsia',
    },
    {
      color: 'pink',
    },
    {
      color: 'forest green',
    },
    {
      color: 'green',
    },
    {
      color: 'lime',
    },
    {
      color: 'chartreuse',
    },
    {
      color: 'olive',
    },
    {
      color: 'yellow',
    },
    {
      color: 'gold',
    },
    {
      color: 'navy',
    },
    {
      color: 'blue',
    },
    {
      color: 'teal',
    },
    {
      color: 'aqua',
    },
    {
      color: 'royal blue',
    },
    {
      color: 'sky blue',
    },
  ]);
};
