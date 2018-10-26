import Trapping from '../models/trapping';


export const getBeetleData = () => {
	return Trapping.find({})
};