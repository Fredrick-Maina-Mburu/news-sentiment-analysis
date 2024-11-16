import { Router } from 'express';
import { fetchByTopic, fetchNews } from '../controllers/newsController';

const router = Router();

router.get('/update', fetchByTopic);
router.get('/', fetchNews); // Fetch all news

export default router;
