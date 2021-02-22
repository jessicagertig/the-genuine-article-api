/* eslint-disable prettier/prettier */
const router = require('express').Router();
const Images = require('./items-images-model');
const {
	ImageUploader,
	ResizedMainImageUploader,
	SecondaryImagesUploader
} = require('../utils/imageUploader');
const { defineParams } = require('../utils/parseFiles');
const checkItemImageExists = require('./image-middleware')

//get original main_image by item_id
router.get('/main_image/:item_id', (req, res) => {
	const item_id = req.params.item_id;

	Images.findMainImageByItemId(item_id)
		.then((img) => {
			res.status(200).json(img);
		})
		.catch((error) => {
			res.status(500).json({
				message: 'Error on server end getting original main image:',
				error
			});
		});
});

//post original main_image by item_id
router.post('/main_image/:item_id', checkItemImageExists, async (req, res) => {
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
			res.status(201).json(img);
		})
		.catch((error) => {
			res
				.status(500)
				.json({ message: 'Error on server end', error });
		});
});

//put original main_image by item_id
router.put('/main_image/:item_id', async (req, res) => {
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
	

	Images.updateMainImage({ main_image_url, item_id })
		.then((imgUpdate) => {
			Images.findMainImageByItemId(item_id)
				.then(img => {
					if (imgUpdate === 1) {
						res
							.status(200)
							.json(img)
					} else {
						res
							.status(406)
							.json({ message: "The server returned an incorrect response"})
					}
				})
				.catch(error => {
					res
						.status(500)
						.json({ message: "There was an error while modifying the user in the database", error})
				})
		
		});
});

//post main_image in 5 new sizes
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

//post secondary image in 3 sizes, orginal not posted
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
