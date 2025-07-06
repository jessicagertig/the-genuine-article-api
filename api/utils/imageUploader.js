const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');
const Sharp = require('sharp');

//modelName is type of image uploaded for example, in future it might be userProfile, but for now it's just going to be mainImage, additionalImage

class ImageUploader {
  constructor(modelName, sizes = {}, types = []) {
    (this.modelName = modelName),
      (this.sizes = sizes),
      (this.types = types),
      (this.config = {
        //current version of amazon S3 API (see: https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
        apiVersion: '2006-03-01',
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_KEY_ID,
          secretAccessKey: process.env.S3_SECRET
        }
      }),
      (this.s3 = new S3Client(this.config));
  }
  //method to predefine path for uploaded items based on input params
  dir(id) {
    return `garment_item_id${id}/${this.modelName}`;
  }

  //The MAIN IMAGE should NOT be deleted without a replacement being added
  //SECONDARY IMAGES SHOULD BE ABLE TO BE DELETED WITHOUT REPLACEMENT
  //THE MAIN IMAGE TABLE & RESIZED MAIN IMAGES TABLE HAVE BEEN CONSOLIDATED. For the time being, refactoring the function in the images router file allowed the original and resized versions of the main image to all be uploaded and urls saved to the db.

  //method to delete the original (unaltered) version of the image uploaded
  async deleteOriginalImage(id, file_name) {
    console.log('ID', id);
    console.log('FILE NAME', file_name);
    const Bucket = process.env.S3_BUCKET_NAME;
    try {
      const command = new DeleteObjectCommand({
        Bucket,
        Key: `${this.dir(id)}/${file_name}`
      });
      await this.s3.send(command);
      const path = `${this.dir(id)}/${file_name}`;
      console.log(`Success deleting image at path: ${path}`);
    } catch (err) {
      console.log(
        `Error deleting image at path: ${this.dir(id)}/${file_name}`,
        err
      );
    }
  }

  //upload image in the largest original size available
  //TODO: limit maximum size
  async uploadOriginalImage(id, file_name, body, content_type, md5) {
    const Bucket = process.env.S3_BUCKET_NAME;
    try {
      const command = new PutObjectCommand({
        Bucket,
        Body: body,
        Key: `${this.dir(id)}/${file_name}`,
        ContentType: content_type,
        ContentMD5: md5,
        ACL: 'public-read'
      });

      const data = await this.s3.send(command);

      console.log(
        'Original image uploaded successfully. ETag: ',
        data.ETag
      );
      const url = `https://${Bucket}.s3.${
        process.env.S3_REGION
      }.amazonaws.com/${this.dir(id)}/${file_name}`;
      console.log(`URL: ${url}`);
      return url;
    } catch (err) {
      console.error(
        `Error uploading original file "${file_name}". Message: `,
        err
      );
    } // TO DO: use delete function in catch block
  }
}
//End 'parent' class
class DeleteResizedImage extends ImageUploader {
  constructor(modelName) {
    super(modelName, null, [
      'large',
      'tiny_large',
      'display',
      'tiny_display',
      'admin_upload',
      'thumb',
      'tiny_main'
    ]);
  }

  //method to be used by classes which include resizing imagages, to delete all different sizes, depending on class
  async deleteResizedImages(id, file_name) {
    return new Promise((resolve, reject) => {
      const Bucket = process.env.S3_BUCKET_NAME;
      try {
        if (this.types) {
          const types = this.types;
          for (const type of types) {
            try {
              const command = new DeleteObjectCommand({
                Bucket,
                Key: `${this.dir(id)}/${type}_${file_name}`
              });

              this.s3.send(command);
              console.log(
                `Success deleting resized image of type "${type}" with filename "${file_name}".`
              );
            } catch (err) {
              console.log(
                `Error deleting resized image of type "${type}". Message:`,
                err
              );
              reject(err);
            }
          }
        } else {
          const error = new Error(
            'The file types were not defined. No resized images were deleted from S3.'
          );
          console.log('Error message:', error);
          reject(error);
        }
      } catch (err) {
        console.log(
          `Error deleting resized versions of image with filename "${file_name}".  Message: `,
          err
        );
        reject(err);
      }
      resolve();
    });
  }
}

class ResizedMainImageUploader extends ImageUploader {
  constructor(modelName) {
    super(modelName, {
      large: [500, 609], // for garment page
      tiny_large: [500, 609],
      display: [296, 444], //for search view
      tiny_display: [296, 444],
      thumb: [64, 64],
      tiny_main: [0, 0] // main image - to retain original size dimensions replaced in the actual upload function
    });
  }

  //method to upload resized images (resized with Sharp)
  async uploadResizedImages(id, file_name, body) {
    const Bucket = process.env.S3_BUCKET_NAME;
    let baseUrl;
    let ratio;

    try {
      const metadata = await Sharp(body).metadata();
      ratio = metadata.width / metadata.height;

      if (this.sizes) {
        const names = Object.keys(this.sizes);
        for (const name of names) {
          let [width, height] = this.sizes[name];
          if (name === 'tiny_main') {
            const maxHeight = 1200;
            if (metadata.height > maxHeight) {
              // Cap height and calculate proportional width
              const ratio = metadata.width / metadata.height;
              height = maxHeight;
              width = Math.round(maxHeight * ratio);
            } else {
              width = metadata.width;
              height = metadata.height;
            }
          }
          const quality = name.includes('tiny') ? 5 : 100;
          const fitType =
            name.includes('display') || name.includes('main')
              ? 'cover'
              : 'contain';
          console.log('DIMENSIONS & QUALITY', {
            name,
            quality,
            width,
            height
          });
          const sizedBody = await Sharp(body)
            .resize(width, height, {
              fit: fitType,
              background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .toFormat('webp', {
              quality: quality,
              trellisQuantisation: true,
              overshootDeringing: true
            })
            .toBuffer();

          const command = new PutObjectCommand({
            Bucket,
            Body: sizedBody,
            Key: `${this.dir(id)}/${name}_${file_name}`,
            ContentType: 'image/webp',
            ACL: 'public-read'
          });
          await this.s3.send(command);

          console.log(
            `Resized version "${name}" of image was uploaded successfully.`
          );
        }

        baseUrl = `https://${Bucket}.s3.${
          process.env.S3_REGION
        }.amazonaws.com/${this.dir(id)}`;
      }
      return { baseUrl: baseUrl, aspectRatio: ratio };
    } catch (err) {
      console.error(
        `Error uploading resized versions of image with filename "${file_name}".  Message: `,
        err
      );
    }
  }
}

class SecondaryImagesUploader extends ImageUploader {
  constructor(modelName) {
    super(modelName, {
      large: [640, 768],
      thumb: [64, 64]
    });
  }
}

module.exports = {
  ImageUploader,
  ResizedMainImageUploader,
  SecondaryImagesUploader,
  DeleteResizedImage
};
