import express, { Application } from 'express';
import dotenv from 'dotenv';
import { testDBConnection } from './controllers/dbTest';
import newsRoutes from './routes/newsRoutes';
import authRoutes from './routes/authRoutes';
import scheduleNewsFetching from './services/scheduler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// DB test
testDBConnection();

app.use(express.json());

//Schedule news fetching
scheduleNewsFetching();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
