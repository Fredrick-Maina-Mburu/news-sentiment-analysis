import express from 'express';
import {  deleteUser, getUserDetails } from '../controllers/UserController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Delete user
router.delete('/delete', auth, deleteUser);

router.get('/get', auth, getUserDetails);

export default router;
