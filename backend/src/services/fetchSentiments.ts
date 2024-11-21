import pool  from '../config/db';

export const fetchAllSentimentsFromDB = async () => {
  try {
    const res = await pool.query('SELECT n.industry, DATE(n.published_at) AS published_at, AVG(s.score) AS score FROM sentiment_scores s INNER JOIN news n ON s.news_id = n.news_id GROUP BY n.industry, DATE(n.published_at) ORDER BY n.industry, published_at');
    return res.rows;
    
  } catch (error) {
    console.log('Error fetching news from DB:', error);
  }

}