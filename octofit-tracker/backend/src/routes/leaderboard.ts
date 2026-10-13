import { Router } from 'express';
import Leaderboard from '../models/Leaderboard';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(await Leaderboard.find().sort({ rank: 1, points: -1 }).populate('user'));
});

export default router;
