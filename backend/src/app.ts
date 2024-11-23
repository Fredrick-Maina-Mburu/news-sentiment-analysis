import express, { Application } from 'express';
import dotenv from 'dotenv';
import { testDBConnection } from './controllers/dbTest';
import newsRoutes from './routes/newsRoutes';
import authRoutes from './routes/authRoutes';
import subRoutes from './routes/subscriptionRoutes';
import sentimentRoutes from './routes/sentimentsRoutes';
import userRoutes from './routes/userRoutes';
import scheduleNewsFetching from './services/scheduler';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// DB test
testDBConnection();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//Schedule news fetching
scheduleNewsFetching();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscribe', subRoutes);
app.use('/api/sentiments', sentimentRoutes);
app.use('/api/user', userRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
