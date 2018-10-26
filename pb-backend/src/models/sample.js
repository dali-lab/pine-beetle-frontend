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

// PollSchema.virtual('score').get(function scoreCalc() {
//   return this.upvotes - this.downvotes;
// });
const SampleDataModel = mongoose.model('SampleData', SampleDataSchema);
export default SampleDataModel;