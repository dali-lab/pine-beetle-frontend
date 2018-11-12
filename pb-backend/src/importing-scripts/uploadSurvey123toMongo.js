import axios from 'axios'

const survey123URL = "https://services3.arcgis.com/dOOr6AQOcTIg6tBw/arcgis/rest/services/service_765fc8be50884d29b37ee120d68ea6de/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=Vu9Bl12svq_wPtrqq4g9kMoAWLRTo4pflWh2IoAaOwqZsg4VngH9wGifWLQG318zY9YNjJNISwWVsuiIuw7dTKO63_9qP2Skt6gqXZaLFonTqV1SkrMwYHk1Wv1TTC5ZvlgACKMsUZCE_fAOpHSgfSVQSW0ZQDtzw3gwv0D8UqXGAMaHWN71qPAM7bTGAZa_DA8f2lpY9rA6P8WZBkp_ZIGno7YJh6Ry_n8amM2sFVk";
const localURL = "http://localhost:9090/v1/"
//TODO setup switch between local and deployed

const getData = async () => {
  try {
    return axios.get(survey123URL)
  } catch (error) {
    console.error(error)
  }
}

const uploadData = async (dataToUpload) => {
	try {
		return axios.post(localURL+'uploadSurvey123', dataToUpload)
	} catch (error) {
		console.log(error)
	}
}

const uploaded = getData().then((response) => {
	// console.log(response.data.features)
	const object = response.data.features
	uploadData(object).then((result) => {
		console.log(result)
	}).catch((err) => {
		console.log(err)
	})
}).catch((error) => {
	console.log(error)
})