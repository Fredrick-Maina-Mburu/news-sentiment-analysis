import pool from '../config/db';

export const testDBConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected at:', res?.rows?.[0]?.now || 'unknown time');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};