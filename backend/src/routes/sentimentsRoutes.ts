import { Router } from 'express';
import { fetchSentiments } from '../controllers/sentimentsController';

const router = Router();

router.get('/', fetchSentiments); 

export default router;