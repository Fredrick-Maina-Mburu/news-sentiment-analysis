import express from 'express';
import { registerUser, loginUser } from '../controllers/authControllers';

const router = express.Router();

// Register and login user routes
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
