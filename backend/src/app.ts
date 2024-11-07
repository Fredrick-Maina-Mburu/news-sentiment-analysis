import express, { Application } from 'express';
import dotenv from 'dotenv';
import { testDBConnection } from './controllers/dbTest';
import newsRoutes from './routes/newsRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// DB test
testDBConnection();

app.use(express.json());

// Routes
app.use('/api/news', newsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
