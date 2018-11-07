/* for testing purposes
 * Sample allows you to import data from partners' excel sheet on model
 */
import mongoose, { Schema } from 'mongoose';

const SampleDataSchema = new Schema({
	state: String,
	forest: String,
	year: Number,
	SPBt: Number,
	spotst1: Number,
	spotst2: Number,
	cleridst1: Number,
	endobrevicomin: Number,
	probabilityAny: Number,
	expectedSpots: Number,
	probabilityFifty: Number,
	probabilityHundredFifty: Number,
	probabilityFourHundred: Number,
	probabilityThousand: Number,
	probabilityThreeThousand: Number,
}, {
	toJSON: {
		virtuals: true,
	},

});


const SampleDataModel = mongoose.model('SampleData', SampleDataSchema);
export default SampleDataModel;