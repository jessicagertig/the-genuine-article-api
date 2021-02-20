/* eslint-disable prettier/prettier */
const AWS = require('aws-sdk');
const Sharp = require('sharp');

//modelName is type of image uploaded for example, in future it might be userProfile, but for now it's just going to be mainImage, additionalImage

class ImageUploader {
	constructor(modelName, sizes = {}) {
		this.modelName = modelName,
		this.sizes = sizes,
		this.config = {
			//current version of amazon S3 API (see: https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
			apiVersion: '2006-03-01',
			accessKeyId: process.env.S3_KEY_ID,
			secretAccessKey: process.env.S3_SECRET,
			region: process.env.S3_REGION
		},
		this.s3 = new AWS.S3(this.config)
	}
	//method to predefine path for uploaded items based on input params
	dir(id) {
		return `garment_item_id${id}/${this.modelName}`;
	}
	//method to delete the original version of the image uploaded, there is no try/catch block here because currently I will call it inside of of a method 
	async deleteOriginalImage(id, fileName) {
		const Bucket = process.env.S3_BUCKET_NAME;
		//will the simple return await with a .promise.catch eliminate need for try/catch block?
		return await this.s3
		.deleteObject({ Bucket, Key: `${this.dir(id)}/${fileName}` })
		.promise()
		.catch(err => console.log('Error deleting original image', err));
	};

	async deleteResizedImages(id, fileName) {
		const Bucket = process.env.S3_BUCKET_NAME;
		//switch if statement to nest inside try block
		try {
			if (this.sizes) {
				const names = Object.keys(this.sizes);
				for (const name of names) {
					await this.s3
					.deleteObject({
						Bucket,
						Key: `${this.dir(id)}/${name}_${fileName}`
					})
					.promise()
					.catch(err => console.error('Error deleting resized images', err));
				}
			} 
		}	catch (err) {
			console.error(err)
		}
	};
	
	async uploadOriginalImage(id, fileName, body, contentType, md5) {
		const Bucket = process.env.S3_BUCKET_NAME;
		let url;
		try {
			await this.s3.putObject({
				Bucket,
				Body: body,
				Key: `${this.dir(id)}/${fileName}`,
				ContentType: contentType,
				ContentMD5: md5,
				ACL: 'public-read'
			})
			.promise()
			.then((data) => console.log('Original image uploaded successfully. Etag: ', data.ETag))
			.catch(err => console.error('Error uploading original file: ', err))
			//sanity test this to see if .then and .catch will block the delete function from running in below catch block
			url = `http://${Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${this.dir(id)}/${fileName}`;
		} catch (err) {
			console.error('Error uploading orignial image.')
			this.deleteOriginalImage(id, fileName)
		}
		return url
	}
	

	async uploadResizedImages(id, fileName, body, contentType) {
		const Bucket = process.env.S3_BUCKET_NAME;

		try {
			if (this.sizes) {
				const names = Object.keys(this.sizes);
				for (const name of names) {
					const [width, height] = this.sizes[name];
					const sizedBody = await Sharp(body)
					.resize(width, height, {
						fit: 'contain',
						background: { r: 255, g: 255, b: 255, alpha: 1 }
					})
					.toBuffer();
					
					await this.s3
						.upload({
							Bucket,
							Body: sizedBody,
							Key: `${this.dir(id)}/${name}_${fileName}`,
							ContentType: contentType,
							ACL: 'public-read'
						})
						.promise()
						.then(console.log(`Files were uploaded succesfully`))
						.catch(err => console.error('err', err));
				}	
			}			
		} catch (err) {
			console.error('Error deleting uploading resized images.')
			this.deleteResizedImages(id, fileName)
		}
	}
	//end methods
}

//End 'parent' class

class ResizedImageUploader extends ImageUploader {
	constructor(modelName) {
		super(modelName, {
			main_large: [500, 609],
			main_display: [450, 582],
			main_admin_upload: [250, 305],
			main_small: [96, 117],
			main_thumb: [64, 78]
		});
	}
}

module.exports = {
	ImageUploader,
	ResizedImageUploader
};