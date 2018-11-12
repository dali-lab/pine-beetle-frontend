import express, {Router} from 'express';
import historical from './controllers/historical_controller';
import controller from './controllers/survey123_controller';
import { makePredictions } from './runRModel';

const router = express();

router.get('/getHistoricals', (req, res) => {
	historical.getHistoricalData().then((data) => {
		res.send(data);
	});
});

router.get('/getSpots', (req, res) => {
	controller.getSpotData().then((data) => {
		res.send(data);
	});
});

router.get('/getBeetles', (req, res) => {
	controller.getBeetleData().then((data) => {
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

router.post('/uploadSurvey123', (req, res) => {
	dataArray = req.body;
	console.log(dataArray);
	controller.batchUpload(dataArray).then((uploaded) => {
		res.send(uploaded);
	})
})

export default router;