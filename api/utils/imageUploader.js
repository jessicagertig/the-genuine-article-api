/* eslint-disable prettier/prettier */
const AWS = require('aws-sdk');
const { error } = require('console');
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

	async delete(id, fileName) {
		const Bucket = process.env.S3_BUCKET_NAME;
		
		await this.s3
		.deleteObject({ Bucket, Key: `${this.dir(id)}/${fileName}` })
		.promise()
		if (this.sizes) {
			const names = Object.keys(this.sizes);
			for (const name of names) {
				await this.s3
				.deleteObject({
					Bucket,
					Key: `${this.dir(id)}/${name}_${fileName}`
				})
				.promise();
			}
		}
	};
	
	async upload(id, fileName, body, contentType, md5) {
		const Bucket = process.env.S3_BUCKET_NAME;
		// console.log('body', body)
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
			.then(res => res.json('File Uploaded Successfully'))
			.catch(err => res.json({'Error uploading original file': err}))
		}
	

		async uploadSizedImages(id, fileName, body, contentType, md5) {
				const Bucket = process.env.S3_BUCKET_NAME;
				// console.log('body', body)

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
						.then(data => console.log(`File was uploaded succesfully at ${data.location}`))
						.catch(err => console.log('err', err));
				}
			}
		} catch (err) {
			await this.s3
				.deleteObject({ Bucket, Key: `${this.dir(id)}/${fileName}` })
				.promise();
			if (this.sizes) {
				const names = Object.keys(this.sizes);
				for (const name of names) {
					await this.s3
						.deleteObject({
							Bucket,
							Key: `${this.dir(id)}/${name}_${fileName}`
						})
						.promise()						
						.then(data => console.log('Sizes Delete Data', data))
						.catch(err => console.log('Sizes Delete Error', err));
				}
			}
			throw err;
		}
	}
}

//End 'parent' class

class MainImageUploader extends ImageUploader {
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
	MainImageUploader
};