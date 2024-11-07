import { Router } from 'express';
import { updateNews } from '../controllers/newsController';

const router = Router();

router.get('/update', updateNews);

export default router;
