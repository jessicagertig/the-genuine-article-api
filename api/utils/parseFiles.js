const { IncomingForm } = require('formidable');
const fs = require('fs');

const parseFormData = async (req) => {
	return await new Promise((resolve, reject) => {
		const form = new IncomingForm({
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
		const fileStream = await fs.createReadStream(path);
		return fileStream;
	}
	return null;
};

module.exports = {
	parseFormData,
	readUploadedFile
};
