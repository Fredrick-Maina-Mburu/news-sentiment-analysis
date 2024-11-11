import pool  from "../config/db";
import { analyzeSentiment } from "./sentimentService";

// Save news articles in the database
export const saveNewsToDB = async (articles: any[]) => {
  const articlesInsertQuery = `
    INSERT INTO news (title, source, published_at, content, url, industry)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (url) DO NOTHING
    RETURNING news_id;
  `;

  const sentimentInsertQuery = `INSERT INTO sentiment_scores (news_id, sentiment, score)
  VALUES ($1, $2, $3);`;

  const fetchNewsIdQuery = `SELECT news_id FROM news WHERE url = $1;`;

  for (const article of articles) {
    const { title, source, publishedAt, content, url, industry } = article;
    try {
      // Save the article and return the ID if inserted
      let result = await pool.query(articlesInsertQuery, [
        title,
        source,
        publishedAt,
        content,
        url,
        industry,
      ]);

      // If article was not new, fetch existing news_id
      if (result.rows.length === 0) {
        result = await pool.query(fetchNewsIdQuery, [url]);
      }

      if (result.rows.length > 0) {
        const newsId = result.rows[0].news_id;

        // Get sentiment analysis
        const { sentiment, score } = analyzeSentiment(content || title);

        // Insert sentiment analysis results
        await pool.query(sentimentInsertQuery, [newsId, sentiment, score]);
        console.log(
          `Article "${title}" with sentiment saved as "${sentiment}" and score ${score}.`
        );
      }
    } catch (error) {
      console.error("Error saving news to the database:", error);
    }
  }
};