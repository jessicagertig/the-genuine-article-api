const AWS = require('aws-sdk');
const { snakeCase } = require('lodash');
const Sharp = require('sharp');

export class ImageUploader {
	constructor(name, modelName, sizes = {}){
		this.name = inputs.name,
		this.modelName = inputs.modelName,
		this.sizes = inputs.sizes,
		this.config = {
			//current version of amazon S3 API (see: https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
			apiVersion = '2006-03-01',
			accessKeyId = process.env.S3_KEY_ID,
			secretAccessKey = process.env.S3_SECRET,
			region: process.env.S3_REGION
		},
		this.s3 = new AWS.S3(this.config)
	}

	dir = (id) => {
		return `uploads/${snakeCase(this.modelName).toLocaleLowerCase()}/${this.name}/${id}`;
	}

	
}