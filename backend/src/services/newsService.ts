import axios from 'axios';
import pool from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const NYT_API_URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json`;
const GUARDIAN_API_URL = `https://content.guardianapis.com/search`;


const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NYT_API_KEY = process.env.NYT_API_KEY;
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;



// Fetch news from News API
const fetchNewsAPI = async (query: string) => {
  const response = await axios.get(NEWS_API_URL, {
    params: {
      q: query,
      apiKey: NEWS_API_KEY,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 5
    }
  });
  return response.data.articles.map((article: any) => ({
    title: article.title,
    source: article.source.name,
    publishedAt: article.publishedAt,
    content: article.content,
    url: article.url,
    industry: query
  }));
};

// Fetch news from the New York Times API
const fetchNYTAPI = async (query: string) => {
  const response = await axios.get(NYT_API_URL, {
    params: {
      q: query,
      'api-key': NYT_API_KEY,
      sort: 'newest',
      language: 'en',
    },
  });

  return response.data.response.docs.map((article: any) => ({
    title: article.headline.main,
    source: 'The New York Times',
    publishedAt: article.pub_date,
    content: article.abstract || article.lead_paragraph,
    url: article.web_url,
    industry: query,
  }));
};

// Fetch news from The Guardian API
const fetchGuardianAPI = async (query: string) => {
  const response = await axios.get(GUARDIAN_API_URL, {
    params: {
      q: query,
      'api-key': GUARDIAN_API_KEY,
      'order-by': 'newest',
      'page-size': 5,
      lang: 'en',
    },
  });

  return response.data.response.results.map((article: any) => ({
    title: article.webTitle,
    source: 'The Guardian',
    publishedAt: article.webPublicationDate,
    content: article.fields?.trailText || '',
    url: article.webUrl,
    industry: query,
  }));
};

// Fetch news from all APIs
export const fetchAllNews = async (query: string) => {
  const [newsAPIArticles, nytArticles, guardianArticles] = await Promise.all([
    fetchNewsAPI(query),
    fetchNYTAPI(query),
    fetchGuardianAPI(query)
  ]);

  // Combine the news and remove duplicates by URL
  const combinedArticles = [...newsAPIArticles, ...nytArticles, ...guardianArticles];
  const uniqueArticles = combinedArticles.filter(
    (article, index, self) => index === self.findIndex((a) => a.url === article.url)
  );

  return uniqueArticles;
};

// Save news articles in the database
export const saveNewsToDB = async (articles: any[]) => {
  const query = `
    INSERT INTO news (title, source, published_at, content, url, industry)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (url) DO NOTHING;
  `;

  for (const article of articles) {
    const { title, source, publishedAt, content, url, industry } = article;
    try {
      await pool.query(query, [title, source, publishedAt, content, url, industry]);
    } catch (error) {
      console.error('Error saving news to the database:', error);
    }
  }
};
