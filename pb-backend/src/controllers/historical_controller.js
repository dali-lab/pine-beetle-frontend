import HistoricalData from '../models/historical';


export const getHistoricalData = () => {
	return HistoricalData.find({})
};

// export const getHistoricalDataByCounty = (county) => {
// 	HistoricalData.find
// }


// export const editField = (sampleId, field, newValue) => {
// 	SampleData.findOne({ _id: sampleId }).then((example) => {
// 		example.field = newValue;
// 		return example.save();
// 	});
// };