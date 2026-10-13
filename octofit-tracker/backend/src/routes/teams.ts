import { Router } from 'express';
import Team from '../models/Team';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(await Team.find().sort({ name: 1 }));
});

export default router;
