import mongoose, { Schema } from 'mongoose';

// TODO this is a guess at types
const SpotSchema = new Schema({
	county: String,
	spotNo: String,
	latitude: Number,
	longitude: Number,
	dateDetected: Date,
	standType: String,
	species: String,
	ownershipType: String,
	avgHeight: Number,
	avgDBH: Number,
	marketSizeClass: Number,
	avgBasalArea: Number,
	age: Number,
	landform: String,
	initialSpotSize: Number,
	finalSpotSize: Number,
	status: String,
	treatment: String,
}, {
	toJSON: {
		virtuals: true,
	},
});

// PollSchema.virtual('score').get(function scoreCalc() {
//   return this.upvotes - this.downvotes;
// });
const SpotModel = mongoose.model('Spot', SpotSchema);
export default SpotModel;