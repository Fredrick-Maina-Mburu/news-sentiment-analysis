import express from 'express';
import { registerUser, loginUser, logout} from '../controllers/authControllers';
import { loginSchema, registerSchema } from '../validators/userValidators';

const router = express.Router();

// Register and login user routes
router.post('/register',registerSchema, registerUser);
router.post('/login',loginSchema, loginUser);
router.post('/logout', logout);


export default router;
