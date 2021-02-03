const { IncomingForm } = require('formidable');
const promises = require('fs/promises');

const parseFormData = async (req) => {
	return await new Promise((resolve, reject) => {
		const form = new IncomingForm({
			keepExtensions: true,
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
		return await promises.readFile(path);
	}
	return null;
};

module.exports = {
	parseFormData,
	readUploadedFile
};
