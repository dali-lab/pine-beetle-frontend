/* controller conglomerating Trapping and Spot models
 * Survey123 data is one of two types but we determine which 
 * by searching for expected fields 
 */
import Trapping from '../models/trapping';
import Spot from '../models/spot';


export const getSpotData = () => {
	return Spot.find({})
};

export const getBeetleData = () => {
	return Trapping.find({})
};

export const batchUpload = (dataArray) => {
	//distinguish between data models 
	dataArray.forEach((surveyResponse) => {
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
			newSpot.save()
				.catch((err) => {
					console.log(err);
				});

		} 
		else if ('X' in surveyResponse || 'Y' in surveyResponse
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
			newTrapping.save()
				.catch((err) => {
					console.log(err);
				});
		}
	})
};