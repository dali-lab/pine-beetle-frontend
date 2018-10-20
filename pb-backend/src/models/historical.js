import mongoose, { Schema } from 'mongoose';

// TODO this is a guess at types and validation
const HistoricalSchema = new Schema({
	yearNumber: {
		type: Number,
		min: 0
	},
	state: String,
	nf: String,
	classification: String,
	forest: String,
	stateCode: {
		type: Number,
		min: 0
	},
	forestCode: {
		type: Number,
		min: 0
	},
	latitude: {
		type: Number,
		min: -90,
		max: 90
	},
	longitude: {
		type: Number,
		min: -180,
		max: 180
	},
	host: {
		type: Number,
		min: 0
	},
	year: {
		type: Number,
		min: 1900
	},
	spbPerTwoWeeks: {
		type: Number,
		min: 0
	},
	cleridsPerTwoWeeks: {
		type: Number,
		min: 0
	},
	spots: {
		type: Number,
		min: 0
	},
	spotsPerHundredKm: {
		type: Number,
		min: 0
	},
	percentSpb: {
		type: Number,
		min: 0,
		max: 100
	}
}, {
	toJSON: {
		virtuals: true,
	},
});

// PollSchema.virtual('score').get(function scoreCalc() {
//   return this.upvotes - this.downvotes;
// });
const HistoricalModel = mongoose.model('Historical', HistoricalSchema);
export default HistoricalModel;