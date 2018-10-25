import express, {Router} from 'express';
import { getHistoricalData } from './controllers/historical_controller';
import { getSpotData, getBeetleData, batchUpload } from './controllers/survey123_controller';


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

router.post('survey123upload', (req, res) => {
	dataArray = req.body;
	console.log(dataArray);
	batchUpload(dataArray).then((uploaded) => {
		res.send(uploaded);
	})
})

export default router;