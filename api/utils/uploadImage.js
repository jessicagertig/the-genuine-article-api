const AWS = require('aws-sdk');
// const Sharp = require('sharp');

const uploadOriginalImg = async (
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

	const s3 = new AWS.S3(config);

	const dir = `garment_item_id${id}/${modelName}`;
	const Bucket = process.env.S3_BUCKET_NAME;

	//delete any existing object in bucket with same key
	await s3.deleteObject(
		{ Bucket, Key: `${dir}/${fileName}` },
		function (err, data) {
			if (err) {
				throw err;
			}
			console.log('delete data', data);
		}
	);

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
			// eslint-disable-next-line prettier/prettier
			url = `http://${Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${dir}/${fileName}`
			console.log('url', url);
		})
		.catch((err) => {
			console.log('upload failed', err);
		});
	let url = `http://${Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${dir}/${fileName}`;
	console.log('url', url);
	return url;
};

// 	try {
// 		await s3
// 			.upload({
// 				Bucket,
// 				Body: body,
// 				Key: `${dir}/${fileName}`,
// 			})
// 			.promise()
// 			.then((data) =>
// 				console.log(`File uploaded successfully at ${data.Location}`)
// 			)
// 			.catch((err) => console.log('ERROR in TRY', err));
// 	} catch (error) {
// 		await s3.deleteObject
// 			.deleteObject({ Bucket, Key: `${dir}/${fileName}` })
// 			.promise();
// 		throw error;
// 	}
// };

module.exports = {
	uploadOriginalImg
};
