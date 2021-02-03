const router = require('express').Router();
const Images = require('./items-images-model');
const { ImageUploader } = require('../utils/imageUploader');
const {
	parseFormData,
	readUploadedFile
} = require('../utils/parseFiles');

router.post('/main-image/:item_id', async (req, res) => {
	const item_id = req.params.item_id;
	const parsedData = await parseFormData(req);
	console.log('parsedData', parsedData);
	const body = await readUploadedFile(parsedData, 'image');
	const contentType = parsedData.files['image'].type;
	const uploader = new ImageUploader('main_image');
	const md5 = Buffer.from(
		parsedData.files['image'].hash,
		'hex'
	).toString('base64');
	const main_image_url = await uploader.upload(
		item_id,
		parsedData.files['image'].name,
		body,
		contentType,
		md5
	);
	console.log('main_image_url', main_image_url);
	console.log('item_id', item_id);
	Images.addMainImage(main_image_url, item_id)
		.then((img) => {
			res.status(201).json(img);
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end', error });
		});
});

module.exports = router;
