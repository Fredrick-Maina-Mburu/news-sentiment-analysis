import  pool  from '../config/db';
// Fetch news from 
export const fetchNewsByIndustry = async (query: string) => {
  try {
    const res = await pool.query('SELECT n.*, AVG(s.score) AS score, (SELECT sentiment FROM sentiment_scores s2 WHERE s2.news_id = n.news_id GROUP BY sentiment ORDER BY COUNT(*) DESC LIMIT 1) AS sentiment FROM news n INNER JOIN sentiment_scores s ON n.news_id = s.news_id WHERE n.industry = $1 GROUP BY n.news_id ORDER BY n.published_at DESC LIMIT 5', [query]);
    // console.log(res.rows);
    return res.rows;
    
  } catch (error) {
    console.log('Error fetching news from DB:', error);
  }
};

export const fetchAllNewsFromDB = async() => {
  try {
    const res = await pool.query('SELECT DISTINCT n.*, s.score, s.sentiment FROM news n INNER JOIN sentiment_scores s ON n.news_id = s.news_id ORDER BY n.created_at DESC LIMIT 10');
    return res.rows;

  } catch (error) {
    console.error('Error fetching news from DB:', error);
  } 
}