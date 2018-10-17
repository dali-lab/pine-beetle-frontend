import express, {Router} from 'express';
import { getSampleData, uploadSampleData } from './controllers/sample_controller';

const router = express();

router.get('/', (req, res) => {
	getSampleData().then((data) => {
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