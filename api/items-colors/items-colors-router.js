const router = require('express').Router();
const Colors = require('./items-colors-model');
const {
  checkForDuplicateColors,
  checkForDuplicateColorOptions
} = require('./items-colors-validation');
const { checkForRequestBody } = require('../items/items-middleware');
const restricted = require('../auth/restricted_middleware');
const { permit } = require('../auth/auth-middleware');

router.post(
  '/colors',
  restricted,
  permit('admin'),
  checkForRequestBody,
  checkForDuplicateColorOptions,
  async (req, res) => {
    console.log('POST colors req.body', { body: req.body });
    const color = req.body.color_option;
    Colors.addColor(color)
      .then((item) => {
        const new_item = item[0];
        res.status(201).json(new_item);
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end adding color.`,
          error
        });
      });
  }
);

router.put(
  '/colors/:color_id',
  restricted,
  permit('admin'),
  checkForRequestBody,
  checkForDuplicateColorOptions,
  async (req, res) => {
    console.log('PUT colors req.body', { body: req.body });
    const color = req.body.color;
    const color_id = req.params.color_id;
    Colors.editColor(color, color_id)
      .then((item) => {
        const edited_item = item[0];
        res.status(200).json(edited_item);
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end editing color.`,
          error
        });
      });
  }
);

router.delete(
  '/colors/:color_id',
  restricted,
  permit('admin'),
  async (req, res) => {
    console.log('DELETE colors req.body', { body: req.body });
    const color_id = req.params.color_id;
    Colors.deleteColor(color_id)
      .then((item) => {
        res.status(200).json(item);
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end deleting color.`,
          error
        });
      });
  }
);

//post item-colors
router.post(
  '/:item_id',
  restricted,
  permit('admin'),
  checkForRequestBody,
  checkForDuplicateColors,
  async (req, res) => {
    const item_id = req.params.item_id;
    console.log('req.body', req.body.fields);
    Colors.insertItemColors(item_id, req.body.fields)
      .then((item) => {
        res.status(201).json(item);
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end posting colors for item with id ${item_id}.`,
          error
        });
      });
  }
);

//get item colors by item_id
router.get('/:item_id', (req, res) => {
  const item_id = req.params.item_id;

  Colors.findColorsByItemId(item_id)
    .then((item_colors) => {
      console.log('item_colors', item_colors);
      if (item_colors.length > 0) {
        let colors_dict = {};
        for (let i = 0; i < item_colors.length; i++) {
          colors_dict[item_colors[i].color] =
            item_colors[i].color_id;
        }
        res
          .status(200)
          .json({ item_id: item_id, colors: colors_dict });
      } else {
        res.status(404).json({
          message: `No colors have been added for item with id ${item_id}.`
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error on server end getting colors for item with id ${item_id}.`,
        error
      });
    });
});

//get items by color_id
router.get('/color/:color_id', (req, res) => {
  const color_id = req.params.color_id;

  Colors.findItemsByColorId(color_id)
    .then((items) => {
      if (items.length > 0) {
        res.status(200).json(items);
      } else {
        res.status(404).json({
          message: `No items exist which list the color with id ${color_id}.`
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error on server end getting all items listing the color with id ${color_id}.`,
        error
      });
    });
});

//delete item color by item_id and color_id
router.delete(
  '/:item_id',
  restricted,
  permit('admin'),
  (req, res) => {
    const item_id = req.params.item_id;
    const color_id = req.body.color_id;

    Colors.removeItemColor(item_id, color_id)
      .then((item_color) => {
        console.log('item_color', item_color);
        if (item_color.length > 0) {
          res.status(200).json({
            message: `Color with id ${color_id} deleted from record of garment with id ${item_id}.`
          });
        } else {
          res.status(404).json({
            message: `No record with item_id ${item_id} and color_id ${color_id} exists.`
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end deleting color from item with id ${item_id}.`,
          error
        });
      });
  }
);

module.exports = router;
