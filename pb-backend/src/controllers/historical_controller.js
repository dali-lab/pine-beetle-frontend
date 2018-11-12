/* all historical data is in src/data/SPB2016_toDALI.csv
 * identical info as SPB2016_toDALI.json, converted for convenience
 */
import HistoricalData from '../models/historical';


const getHistoricalData = () => {
	return HistoricalData.find({})
};

const uploadHistorical = async (historicalData) => {
	let dataArray = [];
	console.log(historicalData)
	historicalData.forEach((historicalObj) => {
		const historicalImport = {};
		
		historicalImport.yearNumber = historicalObj["YearNum"]
		historicalImport.state = historicalObj["STATE"]
		historicalImport.nf = historicalObj["NF"]
		historicalImport.classification = historicalObj["Classification"]
		historicalImport.forest = historicalObj["Forest"]
		historicalImport.stateCode = historicalObj["StateCode"]
		historicalImport.forestCode = historicalObj["ForestCode"]
		historicalImport.latitude = historicalObj["latitude"]
		historicalImport.longitude = historicalObj["longitude"]
		historicalImport.host = historicalObj["Host 1000ha"]
		historicalImport.year = historicalObj["Year"]
		historicalImport.spbPerTwoWeeks = historicalObj["spb / trap / 14 d"]
		historicalImport.cleridsPerTwoWeeks = historicalObj["Clerids/ trap/ 14 d"]
		historicalImport.spots = historicalObj["Spots"]
		historicalImport.spotsPerHundredKm = isNaN(historicalObj["Spots/100km"]) ? null : historicalObj["Spots/100km"];
		historicalImport.percentSpb = historicalObj["%SPB"]

		dataArray.push(historicalImport);
	});

	HistoricalData.insertMany(dataArray, { ordered: false }, (err, docs) => {
		if (err) {
			console.log(err)
		} else {
			// console.log(docs)
		}
	});
}



const historical = { getHistoricalData, uploadHistorical }
export default historical;
