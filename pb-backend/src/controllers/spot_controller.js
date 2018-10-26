import Spot from '../models/spot';


export const getSpotData = () => {
	return Spot.find({})
};