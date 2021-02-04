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
		return `uploads/images/garment_item_id${id}/${snakeCase(this.modelName).toLocaleLowerCase()}`;
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
				.promise();
			}
		}
	};
	
	async upload(id, fileName, body, contentType, md5) {
		let urls = []
		const Bucket = process.env.S3_BUCKET_NAME;
		try {
			await this.s3
			.putObject({
				Bucket,
				Body: body,
				Key: `${this.dir(id)}/${fileName}`,
				ContentType: contentType,
				ContentMD5: md5,
				ACL: 'public-read'
			})
			.promise()
			.then(data => {
				const hash = Buffer.from(md5, 'base64').toString('hex')
				if (data.ETag === `"${hash}"`){
					const main_image_url = `http://${Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${this.dir(id)}/${fileName}`
					urls.push(main_image_url)
				}
			})
			.catch(err => console.log('err', err));

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
						.putObject({
							Bucket,
							Body: sizedBody,
							Key: `${this.dir(id)}/${name}_${fileName}`,
							ContentType: contentType,
							ACL: 'public-read'
						})
						.promise()
						.then(data => {
							if (data.ETag) {
								let url = `http://${Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${this.dir(id)}/${name}_${fileName}`
								urls.push(url)
							}
						})
						.catch(err => console.log('err', err));
				}
				return urls
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
						.then(data => console.log('data', data))
						.catch(err => console.log('err', err));
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