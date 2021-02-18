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

module.exports = {
	parseFormData,
	readUploadedFile
};
