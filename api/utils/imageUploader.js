/* eslint-disable prettier/prettier */
const AWS = require('aws-sdk');
const { snakeCase } = require('lodash');
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
	
	dir(id) {
		return `uploads/images/garment_item_id:${id}/${snakeCase(this.modelName).toLocaleLowerCase()}`;
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
				.deletObject({
					Bucket,
					Key: `${this.dir(id)}/${name}_${fileName}`
				})
				.promise()
			}
		}
	}
	
	async upload(id, fileName, body) {
		console.log('filename', fileName)
		const Bucket = process.env.S3_BUCKET_NAME;
		console.log('Bucket', Bucket)
		const Key = `${this.dir(id)}/${fileName}`
		console.log('KEY', Key)
		try {
			await this.s3
			.putObject({
				Body: body,
				Bucket,
				Key: `${this.dir(id)}/${fileName}`,
				// ContentType: contentType,
				// ACL: 'public-read'
			})
			.promise()
			
			if (this.sizes) {
				const names = Object.keys(this.sizes);
				for (const name of names) {
					const [width, height] = this.sizes[name];
					const sizedBody = await Sharp(body)
					.resize(width, height, {
						fit: 'contain',
						background: { r: 255, g: 255, b: 255, a: 1 }
					})
					.toBuffer()
					
					await this.s3
					.putObject({
						Bucket,
						Body: sizedBody,
						Key: `${this.dir(id)}/${name}_${fileName}`,
						// ContentType: contentType,
						// ACL: 'public-read'
					})
					.promise()
				}
			}
		} catch (err) {
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
					.promise()
				}
			}
			throw err
		}
	}
}
//End 'parent' class

class AdminUploader extends ImageUploader {
	constructor(modelName) {
		super(modelName, {
			large: [500, 609],
			display: [450, 582],
			adminUploadMain: [250, 305],
			thumb: [64, 78]
		});
	}
}

module.exports = {
	ImageUploader,
	AdminUploader
};