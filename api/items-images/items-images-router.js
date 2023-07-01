const router = require('express').Router();
const Images = require('./items-images-model');
const {
  ImageUploader,
  ResizedMainImageUploader,
  SecondaryImagesUploader,
  DeleteResizedImage
} = require('../utils/imageUploader');
const { defineParams } = require('../utils/parseFiles');
const checkItemImageExists = require('./image-middleware');

//get original main_image by item_id
router.get('/main_image/:item_id', (req, res) => {
  const item_id = req.params.item_id;

  Images.findMainImageByItemId(item_id)
    .then((img) => {
      if (img === null) {
        return res.status(400).json({
          message: `No main image exists for item with id ${item_id}.`
        });
      } else {
        res.status(200).json(img);
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Error on server end getting original main image:',
        error
      });
    });
});

//post original main_image & resized versions by item_id
router.post(
  '/main_image/:item_id',
  checkItemImageExists,
  async (req, res) => {
    const item_id = req.params.item_id;
    const [body, content_type, file_name, md5] = await defineParams(
      req
    );
    // upload the original image to s3
    const upload = new ImageUploader('original_main_image');
    const main_image_url = await upload.uploadOriginalImage(
      item_id,
      file_name,
      body,
      content_type,
      md5
    );
    const resizedUpload = new ResizedMainImageUploader(
      'resized_main_image'
    );
    const baseUrl = await resizedUpload.uploadResizedImages(
      item_id,
      file_name,
      body,
      content_type
    );
    // save the urls to the db
    Images.addMainImageSizes(
      main_image_url,
      baseUrl,
      file_name,
      item_id
    )
      .then((img) => {
        res.status(201).json({ ...img });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: 'Error on server end', error });
      });
  }
);

//put original main_image by item_id
router.put('/main_image/:item_id', async (req, res) => {
  const item_id = req.params.item_id;
  const [body, content_type, file_name, md5] = await defineParams(
    req
  );
  const upload = new ImageUploader('original_main_image');
  const main_image_url = await upload.uploadOriginalImage(
    item_id,
    file_name,
    body,
    content_type,
    md5
  );

  Images.updateMainImage({ main_image_url, item_id }).then(
    (imgUpdate) => {
      Images.findMainImageByItemId(item_id)
        .then((img) => {
          if (imgUpdate === 1) {
            res.status(200).json(img);
          } else {
            res.status(406).json({
              message: 'The server returned an incorrect response'
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            message:
              'There was an error while modifying the user in the database',
            error
          });
        });
    }
  );
});

//delete original unaltered main image from database
router.delete('/main_image/:item_id', async (req, res) => {
  const item_id = req.params.item_id;
  try {
    // get file_name from db
    const image_info = await Images.findMainImageByItemId(item_id);
    console.log('GET FILE', image_info);
    const file_name = image_info ? image_info.file_name : null;
    // delete original main image from s3
    if (file_name !== undefined && file_name !== null) {
      const deleteUpload = new ImageUploader('original_main_image');
      await deleteUpload.deleteOriginalImage(item_id, file_name);
      // delete resized main image from s3
      const deleteResizedUpload = new DeleteResizedImage(
        'resized_main_image'
      );
      await deleteResizedUpload.deleteResizedImages(
        item_id,
        file_name
      );
      console.log(
        'The images should have been successfuly deleted from AWS S3'
      );
    } else {
      return res.status(500).json({
        message:
          'There was an error retrieving the image information from the DB. The item could not be deleted.'
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'There was an error deleting the image from AWS S3.'
    });
  }

  // delete main image record from db
  Images.removeMainImage(item_id)
    .then((result) => {
      if (result) {
        return res.status(200).json({
          message: `The main image for item with id ${item_id} has been deleted from the DB.`
        });
      } else {
        return res.status(400).json({
          message: `No main image existed for item with id ${item_id} in the DB.`
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        message: `An error occured while deleting the main image from the 
        DB for item with id ${item_id}`,
        error
      });
    });
});

//post secondary image in 3 sizes, orginal not posted
router.post('/secondary_images/:item_id', async (req, res) => {
  const item_id = req.params.item_id;
  const [body, content_type, file_name] = await defineParams(req);
  const upload = new SecondaryImagesUploader('secondary_images');
  const baseUrl = await upload.uploadResizedImages(
    item_id,
    file_name,
    body,
    content_type
  );

  Images.addSecondaryImageSizes(baseUrl, file_name, item_id)
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
