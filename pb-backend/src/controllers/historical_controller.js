/* all historical data is in src/data/SPB2016_toDALI.csv
 * identical info as SPB2016_toDALI.json, converted for convenience
 */
import HistoricalData from '../models/historical';


const getHistoricalData = () => {
	return HistoricalData.find({})
};

const historical = { getHistoricalData }
export default historical;
