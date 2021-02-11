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
	const body = await readUploadedFile(parsedData, 'image');
	const contentType = parsedData.files['image'].type;
	const uploader = new ImageUploader('main_image');
	const md5 = parsedData.files['image'].hash, 'hex').
	const main_image_url = await uploader.upload(
		item_id,
		parsedData.files['image'].name,
		body,
		contentType,
		md5
	);
	Images.addMainImage({ main_image_url, item_id })
		.then((img) => {
			res.status(201).json({ ...img, main_image_url });
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end', error });
		});
});

module.exports = router;
