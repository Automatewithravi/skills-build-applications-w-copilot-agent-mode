import { Router } from 'express';
import Workout from '../models/Workout';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(await Workout.find().sort({ title: 1 }));
});

export default router;
