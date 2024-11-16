import  pool  from '../config/db';
// Fetch news from 
export const fetchNewsByIndustry = async (query: string) => {
  try {
    const res = await pool.query('SELECT n.*, s.score, s.sentiment FROM news n INNER JOIN sentiment_scores s ON n.news_id = s.news_id WHERE industry = $1 ORDER BY published_at DESC LIMIT 5', [query]);
    // console.log(res.rows);
    return res.rows;
    
  } catch (error) {
    console.log('Error fetching news from DB:', error);
  }
};

export const fetchAllNewsFromDB = async() => {
  try {
    const res = await pool.query('SELECT n.*, s.score, s.sentiment FROM news n INNER JOIN sentiment_scores s ON n.news_id = s.news_id ORDER BY RANDOM() LIMIT 10');
    // console.log(res.rows);
    return res.rows;

  } catch (error) {
    console.error('Error fetching news from DB:', error);
  } 
}