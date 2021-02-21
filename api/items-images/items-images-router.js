const router = require('express').Router();
const Images = require('./items-images-model');
const {
	ImageUploader,
	ResizedMainImageUploader
} = require('../utils/imageUploader');
const {
	parseFormData,
	readUploadedFile
} = require('../utils/parseFiles');

router.post('/main_image/:item_id', async (req, res) => {
	const item_id = req.params.item_id;
	const parsedData = await parseFormData(req);
	const body = await readUploadedFile(parsedData, 'image');
	const contentType = parsedData.files['image'].type;
	const md5 = Buffer.from(
		parsedData.files['image'].hash,
		'hex'
	).toString('base64');
	const upload = new ImageUploader('original_image');
	const main_image_url = await upload.uploadOriginalImage(
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

router.post('/main_image_sizes/:item_id', async (req, res) => {
	const item_id = req.params.item_id;
	const parsedData = await parseFormData(req);
	const body = await readUploadedFile(parsedData, 'image');
	const contentType = parsedData.files['image'].type;
	const fileName = parsedData.files['image'].name;
	const upload = new ResizedMainImageUploader('main_image_sizes');
	const baseUrl = await upload.uploadResizedImages(
		item_id,
		fileName,
		body,
		contentType
	);

	Images.addMainImageSizes(baseUrl, fileName, item_id)
		.then((img) => {
			res.status(201).json({ ...img });
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end', error });
		});
});

module.exports = router;
