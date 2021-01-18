const router = require('express').Router();
const ItemsInfo = require('./items-info-model');

router.get('/items', (req, res) => {
	ItemsInfo.find()
		.then((items) => {
			res.json(items);
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end.', error });
		});
});

module.exports = router;
