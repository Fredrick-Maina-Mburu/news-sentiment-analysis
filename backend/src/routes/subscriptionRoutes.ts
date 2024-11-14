import express from 'express';
import { addSubscription, getSubscriptions, deleteSubscription } from '../controllers/subscriptionControllers';
import { auth } from '../middleware/auth';

const router = express.Router();

// Add new subscription
router.post('/add', auth, addSubscription);

// Get all subscriptions
router.get('/me', auth, getSubscriptions);

// Delete subscription
router.delete('/delete/:subscription_id', auth, deleteSubscription);

export default router;
