/* for testing/development purposes
 * input, edit, and get sample data (src/data/sample_import_data.csv)
 */
import SampleData from '../models/sample';

export const getSampleData = () => {
	return SampleData.find({});
};

export const uploadSampleData = (example) => {
	console.log(example);
	const upload = new SampleData();
	SampleData.schema.eachPath(function(path) {
		upload.path = example.path;
	})
	
	return upload.save()
};

export const editField = (sampleId, field, newValue) => {
	SampleData.findOne({ _id: sampleId }).then((example) => {
		example.field = newValue;
		return example.save();
	});
};

