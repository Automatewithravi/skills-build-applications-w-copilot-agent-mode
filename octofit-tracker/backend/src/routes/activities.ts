import { Router } from 'express';
import Activity from '../models/Activity';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(await Activity.find().sort({ recordedAt: -1 }));
});

export default router;
