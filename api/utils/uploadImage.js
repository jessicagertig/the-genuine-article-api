const AWS = require('aws-sdk');
// const Sharp = require('sharp');

const uploadOriginalImg = (
	id,
	modelName,
	fileName,
	body,
	contentType,
	md5
) => {
	//config for new AWS.S3 bucket
	const config = {
		//current version of amazon S3 API (see: https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
		apiVersion: '2006-03-01',
		region: process.env.S3_REGION,
		accessKeyId: process.env.S3_KEY_ID,
		secretAccessKey: process.env.S3_SECRET
	};
	//initialize s3 with config
	const s3 = new AWS.S3(config);
	//predefine path for uploaded items based on input params
	const dir = `garment_item_id${id}/${modelName}`;
	//get bucket name from .env file
	const Bucket = process.env.S3_BUCKET_NAME;

	//delete any existing object in bucket with same key
	//this is supposed to be S3's default behavior but sometimes remnants seem to briefly load
	s3.deleteObject(
		{ Bucket, Key: `${dir}/${fileName}` },
		function (err) {
			if (err) {
				throw err;
			} else {
				console.log('deleted data');
			}
		}
	);

	//add original image to bucket in size given - may want to limit size somehow
	s3.putObject({
		Bucket,
		Body: Buffer.from(body),
		Key: `${dir}/${fileName}`,
		ContentType: contentType,
		ContentMD5: md5
	})
		.promise()
		.then((data) => {
			console.log(`file uploaded successfully: ${data.ETag}`);
		})
		.catch((err) => {
			console.log('upload failed', err);
		});
	let url = `http://${Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${dir}/${fileName}`;
	return url;
};

module.exports = {
	uploadOriginalImg
};
