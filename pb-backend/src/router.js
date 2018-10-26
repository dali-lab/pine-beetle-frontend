import express, {Router} from 'express';
import { getHistoricalData } from './controllers/historical_controller';
import { getSpotData, getBeetleData, batchUpload } from './controllers/survey123_controller';
import { makePredictions } from './runRModel';

const router = express();

router.get('/', (req, res) => {
	getHistoricalData().then((data) => {
		res.send(data);
	});
});

router.get('/getSpots', (req, res) => {
	getSpotData().then((data) => {
		res.send(data);
	});
});

router.get('/getBeetles', (req, res) => {
	getBeetleData().then((data) => {
		res.send(data);
	});
});

router.get('/getPredictions', (req, res) => {
	// const { SPB, cleridst1, spotst1, spotst2, endobrev } = req.body; //es6 support not working?
	const SPB = req.body["SPB"];
	const cleridst1 = req.body["cleridst1"];
	const spotst1 = req.body["spotst1"];
	const spotst2 = req.body["spotst2"];
	const endobrev = req.body["endobrev"];
	makePredictions(SPB, cleridst1, spotst1, spotst2, endobrev).then((predictions) => {
		res.send(predictions);
	}).catch((err) => {
		re.send(err);
	});
});

router.post('survey123upload', (req, res) => {
	dataArray = req.body;
	console.log(dataArray);
	batchUpload(dataArray).then((uploaded) => {
		res.send(uploaded);
	})
})

export default router;