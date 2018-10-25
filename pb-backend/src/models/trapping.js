import mongoose, { Schema } from 'mongoose';

// TODO this is a guess at types
const TrappingSchema = new Schema({
	x: Number,
	y: Number,
	state: String,
	year: {
		type: Number,
		min: 1900
	},
	lure: String,
	county: String,
	dateTrapSet: Date,
	trapName: String,
	collectorName: String,
	bloomDate: Date,
	weekNo: {
		type: Number,
		min: 0,
		max: 52
	},
	collectionDate: Date,
	trappingInterval: {
		type: Number,
		min: 0
	},
	spb: {
		type: Number,
		min: 0
	},
	clerids: {
		type: Number,
		min: 0
	},
	totalBeetles: {
		type: Number,
		min: 0
	},
	percentSpb: {
		type: Number,
		min: 0,
		max: 100
	},
	spbPerDay: {
		type: Number,
		min: 0
	},
	cleridsPerDay: {
		type: Number,
		min: 0
	}
}, {
	toJSON: {
		virtuals: true,
	},
});

// PollSchema.virtual('score').get(function scoreCalc() {
//   return this.upvotes - this.downvotes;
// });
const TrappingModel = mongoose.model('Trapping', TrappingSchema);
export default TrappingModel;