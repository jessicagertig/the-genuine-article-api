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
	console.log('BODY-Stream:  ', body);
	const uploader = new ImageUploader('main_image');
	const md5 = Buffer.from(
		parsedData.files['image'].hash,
		'hex'
	).toString('base64');
	const main_image = await uploader.upload(
		item_id,
		parsedData.files['image'].name, //fileName
		body,
		parsedData.files['image'].type, //contentType
		md5
	);
	Images.addMainImage(main_image, item_id)
		.then((main_images) => {
			res.status(201).json(main_images);
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end', error });
		});
});

module.exports = router;
