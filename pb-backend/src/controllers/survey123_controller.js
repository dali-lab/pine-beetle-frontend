/* controller conglomerating Trapping and Spot models
 * Survey123 data is one of two types but we determine which 
 * by searching for expected fields 
 */
import Trapping from '../models/trapping';
import Spot from '../models/spot';

const getSpotData = () => {
	return Spot.find({})
};

const getBeetleData = () => {
	return Trapping.find({})
};

// not currently being used
const individualUpload = async (surveyResponse) => {
	if (('Latitude (decimal degrees)' in surveyResponse) || ('Longitude (decimal degrees)' in surveyResponse)
		|| ('Spot No.' in surveyResponse) || ('Initial Spot Size (acres)' in surveyResponse)
		|| ('Final Spot Size (acres)' in surveyResponse) || ('Status' in surveyResponse)) {
		// Spot type
		const newSpot = new Spot();
		newSpot.county = surveyResponse['County']
		newSpot.spotNo = surveyResponse['Spot No.']
		newSpot.latitude = surveyResponse['Latitude (decimal degrees)']
		newSpot.longitude = surveyResponse['Longitude (decimal degrees)']
		newSpot.dateDetected = surveyResponse['Date Detected (mm/dd/yy)']
		newSpot.standType = surveyResponse['Stand Type']
		newSpot.species = surveyResponse['Species']
		newSpot.ownershipType = surveyResponse['Ownership Type']
		newSpot.avgHeight = surveyResponse['Avg. Height (ft.)']
		newSpot.avgDBH = surveyResponse['Avg. DBH (in.)']
		newSpot.marketSizeClass = surveyResponse['Market Size Class']
		newSpot.avgBasalArea = surveyResponse['Avg. Basal Area (ft2/ac)']
		newSpot.age = surveyResponse['Age (yrs)']
		newSpot.landform = surveyResponse['Landform']
		newSpot.initialSpotSize = surveyResponse['Initial Spot Size (acres)']
		newSpot.finalSpotSize = surveyResponse['Final Spot Size (acres)']
		newSpot.status = surveyResponse['Status']
		newSpot.treatment = surveyResponse['Treatment']

		console.log(newSpot);
		return newSpot.save()
			.catch((err) => {
				console.log(err);
			});

	} else if ('X' in surveyResponse || 'Y' in surveyResponse
		|| 'Trap Name' in surveyResponse || 'Collector Name' in surveyResponse
		|| 'Week No' in surveyResponse || 'SPB' in surveyResponse || 'Total beetles' in surveyResponse) {
		// Trapping type
		const newTrapping = new Trapping();
		newTrapping.x = surveyResponse['X']
		newTrapping.y = surveyResponse['Y']
		newTrapping.state = surveyResponse['State']
		newTrapping.year = surveyResponse['Year']
		newTrapping.lure = surveyResponse['Lure']
		newTrapping.county = surveyResponse['County']
		newTrapping.dateTrapSet = surveyResponse['Date Trap Set']
		newTrapping.trapName = surveyResponse['Trap Name']
		newTrapping.collectorName = surveyResponse['Collector Name']
		newTrapping.bloomDate = surveyResponse['Bloom Date']
		newTrapping.weekNo = surveyResponse['Week No']
		newTrapping.collectionDate = surveyResponse['Collection Date']
		newTrapping.trappingInterval = surveyResponse['Trapping Interval']
		newTrapping.spb = surveyResponse['SPB']
		newTrapping.clerids = surveyResponse['Clerids']
		newTrapping.totalBeetles = surveyResponse['Total beetles']
		newTrapping.percentSpb = surveyResponse['%SPB']
		newTrapping.spbPerDay = surveyResponse['SPB/Day']
		newTrapping.cleridsPerDay = surveyResponse['Clerids/Day']

		console.log(newTrapping);
		return newTrapping.save()
			.catch((err) => {
				console.log(err);
			});
	}
}

const batchUpload = async (dataArray) => {
	/* Distinguish between data models, separating dataArray into array of spot type and array of trapping type.
		Call InsertMany() on each of those models once array has been divided. */
	console.log("total num objects to upload:")
	console.log(dataArray.length)

	let spotArray = [];
	let trappingArray = [];

	//distinguish between data models 
	dataArray.forEach((rawResponse) => {
		// console.log(rawResponse.attributes)
		const geometry = rawResponse.geometry
		const surveyResponse = rawResponse.attributes

		// note: trapping data fields were very different from partner-provided labels
		// probably spot data fields are also very different BUT
		// there was not spot data so the following block is not tested:
		if (('Latitude (decimal degrees)' in surveyResponse) || ('Longitude (decimal degrees)' in surveyResponse)
			|| ('Spot No.' in surveyResponse) || ('Initial Spot Size (acres)' in surveyResponse)
			|| ('Final Spot Size (acres)' in surveyResponse) || ('Status' in surveyResponse)) {
			// Spot type
			const newSpot = {}
			newSpot.county = surveyResponse['County']
			newSpot.spotNo = surveyResponse['Spot No.']
			newSpot.latitude = geometry.x
			newSpot.longitude = geometry.y
			newSpot.dateDetected = surveyResponse['Date Detected (mm/dd/yy)']
			newSpot.standType = surveyResponse['Stand Type']
			newSpot.species = surveyResponse['Species']
			newSpot.ownershipType = surveyResponse['Ownership Type']
			newSpot.avgHeight = surveyResponse['Avg. Height (ft.)']
			newSpot.avgDBH = surveyResponse['Avg. DBH (in.)']
			newSpot.marketSizeClass = surveyResponse['Market Size Class']
			newSpot.avgBasalArea = surveyResponse['Avg. Basal Area (ft2/ac)']
			newSpot.age = surveyResponse['Age (yrs)']
			newSpot.landform = surveyResponse['Landform']
			newSpot.initialSpotSize = surveyResponse['Initial Spot Size (acres)']
			newSpot.finalSpotSize = surveyResponse['Final Spot Size (acres)']
			newSpot.status = surveyResponse['Status']
			newSpot.treatment = surveyResponse['Treatment']
			spotArray.push(newSpot)
		} 
		else if ('Trap_name' in surveyResponse || 'Creator' in surveyResponse
			|| 'SPB' in surveyResponse || 'Sum_SPB_Plus_Clerids' in surveyResponse) {
			// Trapping type
			const newTrapping = {
				x: geometry.x,
				y: geometry.y,
				state: surveyResponse['USA_State'],
				year: surveyResponse['Year'],
				lure: surveyResponse['Trap_Lure'],
				county: surveyResponse['County'],
				dateTrapSet: surveyResponse['TrapSetDate'],
				trapName: surveyResponse['Trap_name'],
				collectorName: surveyResponse['Creator'],
				bloomDate: surveyResponse['Initialredbudbloom'],
				weekNo: surveyResponse['Week No'],
				collectionDate: surveyResponse['Collection Date'],
				trappingInterval: surveyResponse['Trapping Interval'],
				spb: surveyResponse['SPB'],
				clerids: surveyResponse['Clerids'],
				totalBeetles: surveyResponse['Sum_SPB_Plus_Clerids'],
				percentSpb: surveyResponse['%SPB'],
				spbPerDay: surveyResponse['SPB/Day'],
				cleridsPerDay: surveyResponse['Overall_Clerids_PerDay']
			}
			trappingArray.push(newTrapping);
		} 
	});
	console.log("num spot type uploaded:")
	console.log(spotArray.length)
	console.log("num trapping type uploaded")
	console.log(trappingArray.length)

	Trapping.insertMany(trappingArray, { ordered: false }, (err, docs) => {
		if (err) {
			console.log(err)
		} else {
			// console.log(docs)
		}
	});

	Spot.insertMany(spotArray, { ordered: false }, (err, docs) => {
		if (err) {
			console.log(err)
		} else {
			// console.log(docs)
		}
	});
};

const controller = { getSpotData, getBeetleData, batchUpload }
export default controller;