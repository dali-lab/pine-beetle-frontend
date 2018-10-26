/*
 * import historical data
 * perform validation checking, fill in missing values
 */
import HistoricalModel from './models/historical'
import mongoose from 'mongoose'
import { localMongoConnection } from './server'

const mongoURI = process.env.MONGODB_URI || localMongoConnection;
mongoose.connect(mongoURI);

// example convert csv to json command line prompt:
//  ./node_modules/csvtojson/bin/csvtojson ./src/data/SPB2016_toDALI.csv > ./src/data/SPB2016_toDALI.json

var historicalData = require('./data/SPB2016_toDALI.json');

historicalData.forEach((historicalObj) => {
	const historicalImport = new HistoricalModel();
	
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

	console.log(historicalImport)
	historicalImport.save()
		.catch((err) => {
			console.log(err);
		})
});