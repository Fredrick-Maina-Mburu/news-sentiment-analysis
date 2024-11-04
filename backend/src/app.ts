import express, { Application } from 'express';
import dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use('/api/news', newsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
