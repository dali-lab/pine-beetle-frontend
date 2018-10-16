import mongoose, { Schema } from 'mongoose';

// TODO this is a guess at types
const TrappingSchema = new Schema({
	x: Number,
	y: Number,
	state: String,
	year: Number,
	lure: String,
	country: String,
	dateTrapSet: Date,
	trapName: String,
	collectorName: String,
	bloomDate: Date,
	weekNo: Number,
	collectionDate: Date,
	trappingInterval: Number,
	spb: Number,
	clerids: Number,
	// totalBeetles: Number,
	// percentSpb: Number,
	// spbPerDay: might not need these fields TODO
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