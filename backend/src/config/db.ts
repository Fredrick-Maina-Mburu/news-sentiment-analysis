import { Pool } from 'pg'
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
