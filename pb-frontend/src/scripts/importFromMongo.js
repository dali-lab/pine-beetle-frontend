import axios from 'axios'

const localURL = "http://localhost:9090/v1/"
//TODO setup switch between local and deployed URL

const getHistoricalData = async () => {
  try {
    return axios.get(localURL+'getHistoricals')
  } catch (error) {
    console.error(error)
  }
}

const historicalData = getHistoricalData().then((data) => {
	console.log(data)
}).catch((err) => {
	console.log(err);
})

// untested
const getSpotData = async () => {
	try {
		return axios.get(localURL+'getSpots')
	} catch (error) {
		console.log(error)
	}
}

const getBeetleData = async () => {
	try {
		return axios.get(localURL + 'getBeetles')
	} catch (error) {
		console.log(error)
	}
}

const dataController = { getHistoricalData, getSpotData, getBeetleData }
export default dataController;

// const spotData = getSpotData().then((data) => {
// 	console.log(data.data)
// }).catch((err) => {
// 	console.log(err);
// })

// const beetleData = getBeetleData().then((data) => {
// 	console.log(data.data)
// }).catch((err) => {
// 	console.log(err);
// })