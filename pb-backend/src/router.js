import express, {Router} from 'express';
import { getSampleData, uploadSampleData } from './controllers/sample_controller';
import { getHistoricalData } from './controllers/historical_controller';
import { getSpotData } from './controllers/spot_controller';
import { getBeetleData } from './controllers/trapping_controller';

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
	
router.post('/upload', (req, res) => {
	console.log("upload");
	uploadSampleData(req.body).then((uploaded) => {
		res.send(uploaded);
	})
})

export default router;