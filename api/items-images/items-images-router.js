const router = require('express').Router();
const Images = require('./items-images-model');
const {
	ImageUploader,
	ResizedMainImageUploader,
	SecondaryImagesUploader
} = require('../utils/imageUploader');
const { defineParams } = require('../utils/parseFiles');

router.post('/main_image/:item_id', async (req, res) => {
	const item_id = req.params.item_id;
	const [body, contentType, fileName, md5] = await defineParams(req);
	const upload = new ImageUploader('original_image');
	const main_image_url = await upload.uploadOriginalImage(
		item_id,
		fileName,
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
	const [body, contentType, fileName] = await defineParams(req);
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

router.post('/secondary_images/:item_id', async (req, res) => {
	const item_id = req.params.item_id;
	const [body, contentType, fileName] = await defineParams(req);
	const upload = new SecondaryImagesUploader('secondary_images');
	const baseUrl = await upload.uploadResizedImages(
		item_id,
		fileName,
		body,
		contentType
	);

	Images.addSecondaryImageSizes(baseUrl, fileName, item_id)
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
