import mongoose, { Schema } from 'mongoose';

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

const SpotModel = mongoose.model('Spot', SpotSchema);
export default SpotModel;