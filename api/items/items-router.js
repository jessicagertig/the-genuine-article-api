const router = require('express').Router();
const Colors = require('../items-colors/items-colors-model');
const Materials = require('../items-materials/items-materials-model');
const Items = require('./items-model');
const ItemsInfo = require('../items-info/items-info-model');
const {
  getGarmentOfTheDay,
  dailyGarmentJob
} = require('./daily-garment-model');
const {
  checkForRequestBody,
  checkForNewItemRequestBody,
  checkForDuplicateItem,
  checkForDuplicatesWhileEditing,
  checkForDuplicateGarmentTitleMenuItem
} = require('./items-middleware');
const restricted = require('../auth/restricted_middleware');
const { permit } = require('../auth/auth-middleware');

//Get all items
router.get('/', async (req, res) => {
  console.log('Request:', req.params);
  try {
    const result = await Items.getAllItems();
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        message: 'There are no items listed. Error on client end.'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error on server end getting all items.',
      error
    });
  }
});

//Get paginated items
router.get('/list', async (req, res) => {
  const page = req.query?.page ? Number(req.query.page) : null;
  const limit = req.query?.limit ? Number(req.query.limit) : null;
  try {
    const result = await Items.getPaginatedItems(page, limit);
    if (result) {
      console.log('hasMore?', result.hasMore);
      res.status(200).json(result);
    } else {
      res.status(404).json({
        message: 'There are no items listed. Error on client end.'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error on server end getting items.',
      error
    });
  }
});

router.get('/pages', async (req, res) => {
  const limit = req.query?.limit ? Number(req.query.limit) : 15;
  try {
    const result = await Items.getPageCount(limit);
    console.log(result);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        message: 'There are no items.'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error on server end getting count.',
      error
    });
  }
});

//get menus, populate dropdown menus on clientside
//function must come before get by item_id else pg will try to insert 'menus' as id
router.get('/menus', async (req, res) => {
  try {
    const colors_menu = await Colors.findAllColors();
    const materials_menu = await Materials.findAllMaterials();
    const garment_titles_menu = await Items.findAllGarmentTitles();
    if (!colors_menu) {
      throw 'Error fetching the color menu.';
    }
    if (!materials_menu) {
      throw 'Error fetching the materials menu.';
    }
    if (!garment_titles_menu) {
      throw 'Error fetching the garment titles menu.';
    }
    const menus = {
      colors_menu: colors_menu,
      materials_menu: materials_menu,
      garment_titles_menu: garment_titles_menu
    };
    return res.status(200).json(menus);
  } catch (error) {
    return res
      .status(500)
      .json({ Message: 'Error fetching menus.', error });
  }
});

router.get('/search', async (req, res) => {
  const search_term = req.query?.q;
  console.log('SEARCH TERM', search_term);
  const page = req.query?.page ? Number(req.query.page) : 1;
  const limit = req.query?.limit ? Number(req.query.limit) : 30;
  const order = req.query?.order || 'asc';
  const sort = req.query?.sort || 'id';
  console.log('sort', sort);
  const decades = req.query?.decades
    ? JSON.parse(req.query.decades)
    : '';
  const colors = req.query?.colors
    ? JSON.parse(req.query.colors)
    : '';
  const materials = req.query?.materials
    ? JSON.parse(req.query.materials)
    : '';
  try {
    const search_results = await Items.searchItems(
      search_term,
      page,
      limit,
      order,
      sort,
      decades,
      colors,
      materials
    );
    console.log('Number of results:', search_results.length);
    return res.status(200).json(search_results);
  } catch (error) {
    return res.status(500).json({
      Message: `Error searching for ${search_term}. ERROR:`,
      error
    });
  }
});

router.get('/keyword_search', async (req, res) => {
  const search_term = req.query?.q;
  console.log('SEARCH TERM', search_term);
  const page = req.query?.page ? Number(req.query.page) : 1;
  const limit = req.query?.limit ? Number(req.query.limit) : 15;
  try {
    const search_results = await Items.simpleSearch(
      search_term,
      page,
      limit
    );
    console.log(search_results);
    return res.status(200).json(search_results);
  } catch (error) {
    return res.status(500).json({
      Message: `Error searching for ${search_term}. ERROR:`,
      error
    });
  }
});

//must be before get item by id so it does not try to use 'daily' as id
router.get('/daily', async (req, res) => {
  try {
    const item = await getGarmentOfTheDay();
    console.log(item);
    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(404).json({
        Message: `Garment of the day not found.`
      });
    }
  } catch (error) {
    res.status(500).json({
      Message: `Error retrieving garment of the day.`,
      error
    });
  }
});

router.post('/daily', async (req, res) => {
  console.log('dailyGarmentJob is running...');
  try {
    const item = await dailyGarmentJob();
    console.log(item);
    // if (item) {
    return res.status(201).json(item);
    // } else {
    // return res.status(404).json({
    //   Message: `Garment of the day not found.`
    // });
    // }
  } catch (error) {
    res.status(500).json({
      Message: `Error in daily garment job post request.`,
      error
    });
  }
});

//get item by item id
router.get('/:item_id', async (req, res) => {
  const item_id = req.params.item_id;
  console.log('Request params:', req.params);

  try {
    const item = await Items.findItemById(item_id);
    console.log(item);
    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(404).json({
        Message: `No item with id ${item_id} was found.`
      });
    }
  } catch (error) {
    res.status(500).json({
      Message: `Error retrieving item with id ${item_id}.`,
      error
    });
  }
});

//post an item
router.post(
  '/',
  restricted,
  permit('admin'),
  checkForNewItemRequestBody,
  checkForDuplicateItem,
  async (req, res) => {
    console.log('Request body:', req.body);
    try {
      const newItem = await Items.createItem(
        req.body.item_info,
        req.body.item_colors,
        req.body.item_materials
      );
      return res.status(201).json(newItem);
    } catch (error) {
      return res
        .status(500)
        .json({ Message: 'Error creating new item.', error });
    }
  }
);

//put item-info (edit main info section only)
router.put(
  '/:item_id',
  restricted,
  permit('admin'),
  checkForRequestBody,
  checkForDuplicatesWhileEditing,
  async (req, res) => {
    const item_id = req.params.item_id;
    console.log('item_id', item_id);
    console.log('req.body', req.body);
    try {
      const existing_item_info = await ItemsInfo.findInfoById(
        item_id
      );
      console.log('existing item info', existing_item_info);
      if (existing_item_info !== undefined) {
        const edited_item = await Items.updateItem(
          item_id,
          req.body.item_info,
          req.body.item_colors,
          req.body.item_materials
        );
        console.log('edited item', edited_item);
        return res.status(200).json(edited_item);
      } else {
        return res.status(404).json({
          message: `No item with id ${item_id} exists.`
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: `Error on server end updating item by id ${item_id}.`,
        error
      });
    }
  }
);

//delete item by item id
router.delete(
  '/:item_id',
  restricted,
  permit('admin'),
  async (req, res) => {
    const item_id = req.params.item_id;
    console.log('Request params:', req.params);
    try {
      const item = await Items.deleteItem(item_id);
      return res.status(200).json(item[0]);
    } catch (error) {
      res.status(500).json({
        Message: `Error deleting item with id ${item_id}.`,
        error
      });
    }
  }
);

// for temp admin use delete item with no image record
router.delete(
  '/admin/:item_id',
  restricted,
  permit('admin'),
  async (req, res) => {
    const item_id = req.params.item_id;

    try {
      const item = await Items.deleteItemNoImage(item_id);
      return res.status(200).json(item[0]);
    } catch (error) {
      res.status(500).json({
        Message: `Error deleting item with id ${item_id}.`,
        error
      });
    }
  }
);

router.post(
  '/garment_titles',
  restricted,
  permit('admin'),
  checkForRequestBody,
  checkForDuplicateGarmentTitleMenuItem,
  async (req, res) => {
    console.log('req.body', req.body);
    let garment_title = req.body.garment_title;
    garment_title = garment_title.replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
    console.log('GARMENT TITLE', { garment_title });
    Items.addGarmentTitle(garment_title)
      .then((item) => {
        res.status(201).json(item);
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end adding garment_title.`,
          error
        });
      });
  }
);

router.put(
  '/garment_titles/:garment_title_id',
  restricted,
  permit('admin'),
  checkForRequestBody,
  checkForDuplicateGarmentTitleMenuItem,
  async (req, res) => {
    console.log('req.body & req.params', {
      body: req.body,
      params: req.params
    });
    const garment_title = req.body.garment_title_option;
    const garment_title_id = req.params.garment_title_id;
    Items.editGarmentTitle(garment_title, garment_title_id)
      .then((item) => {
        res.status(200).json(item);
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end editing garment_title.`,
          error
        });
      });
  }
);

router.delete(
  '/garment_titles/:garment_title_id',
  restricted,
  permit('admin'),
  async (req, res) => {
    console.log('req.body', req.body);
    const garment_title_id = req.params.garment_title_id;
    Items.deleteGarmentTitle(garment_title_id)
      .then((item) => {
        res.status(200).json(item);
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error on server end deleting garment_title.`,
          error
        });
      });
  }
);

module.exports = router;
