/* eslint-disable prettier/prettier */
const AWS = require('aws-sdk');
const { snakeCase } = require('lodash');
const Sharp = require('sharp');

module.exports = {
	ImageUploader,
	AdminUploader
};

class ImageUploader {
	constructor(name, modelName, sizes = {}) {
		this.name = name,
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
		return `uploads/${snakeCase(this.modelName).toLocaleLowerCase()}/${this.name}/${id}`;
	}

	async delete(id, fileName) {
		const Bucket = process.env.S3_BUCKET_NAME;

		await this.s3
			.deleteObject({ Bucket, Key: `${this.dir(id)}/${fileName}` })
			.promise();
		if (this.sizes) {
			const names = Object.keys(this.sizes);
			for (const name of names) {
				await this.s3
					.deletObject({
						Bucket,
						Key: `${this.dir(id)}/${name}_${fileName}`
					})
					.promise();
			}
		}
	}

	async upload(id, fileName, body, contentType) {
		const Bucket = process.env.S3_BUCKET_NAME;

		try {
			await this.s3
				.putObject({
					Bucket,
					Body: body,
					Key: `${this.dir(id)}/${fileName}`,
					ContentType: contentType,
					ACL: 'public-read'
				})
				.promise();

			if (this.sizes) {
				const names = Object.keys(this.sizes);
				for (const name of names) {
					const [width, height] = this.sizes[name];
					const sizedBody = await Sharp(body)
						.resize(width, height, {
							fit: 'contain',
							background: { r: 255, g: 255, b: 255, a: 1 }
						})
						.toBuffer();

					await this.s3
						.putObject({
							Bucket,
							Body: sizedBody,
							Key: `${this.dir(id)}/${name}_${fileName}`,
							ContentType: contentType,
							ACL: 'public-read'
						})
						.promise();
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
						.promise();
				}
			}
			throw err;
		}
	}
}
//End 'parent' class

class AdminUploader extends ImageUploader {
	constructor(name, modelName) {
		super(name, modelName, {
			large: [500, 609],
			display: [450, 582],
			adminUploadMain: [250, 305],
			thumb: [64, 78]
		});
	}
}
