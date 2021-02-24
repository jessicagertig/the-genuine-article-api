const { IncomingForm } = require('formidable');
const fs = require('fs/promises');

const parseFormData = async (req) => {
	return await new Promise((resolve, reject) => {
		const form = new IncomingForm({
			multiples: true,
			hash: 'md5'
		});
		form.parse(req, (err, fields, files) => {
			if (err) return reject(err);
			resolve({ fields, files });
		});
	});
};

const readUploadedFile = async (data, key) => {
	const path = data.files[key].path;
	if (path) {
		try {
			console.log('Path', path);
			const readData = await fs.readFile(path);
			console.log('readData: ', readData);
			return readData;
		} catch (error) {
			console.error(
				`Got an error trying to read the file: ${error.message}`
			);
		}
	}
};

const defineParams = async (req) => {
	const parsedData = await parseFormData(req);
	const body = await readUploadedFile(parsedData, 'image');
	const content_type = parsedData.files['image'].type;
	const file_name = parsedData.files['image'].name;
	const md5 = Buffer.from(
		parsedData.files['image'].hash,
		'hex'
	).toString('base64');
	const params = [body, content_type, file_name, md5];
	return params;
};

module.exports = {
	parseFormData,
	readUploadedFile,
	defineParams
};
