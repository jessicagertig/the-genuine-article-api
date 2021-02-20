const router = require('express').Router();
const Images = require('./items-images-model');
const { ImageUploader } = require('../utils/imageUploader');
const {
	parseFormData,
	readUploadedFile
} = require('../utils/parseFiles');

router.put('/main-image/:item_id', async (req, res) => {
	const item_id = req.params.item_id;
	const parsedData = await parseFormData(req);
	const body = await readUploadedFile(parsedData, 'image');
	const contentType = parsedData.files['image'].type;
	const md5 = Buffer.from(
		parsedData.files['image'].hash,
		'hex'
	).toString('base64');
	const uploadOriginalImg = new ImageUploader('original_image');
	const main_image_url = await uploadOriginalImg.uploadOriginalImage(
		item_id,
		parsedData.files['image'].name, //fileName
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
