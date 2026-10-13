import { Router } from 'express';
import User from '../models/User';

const router = Router();

router.get('/', async (_request, response) => {
  response.json(await User.find().sort({ username: 1 }));
});

export default router;
