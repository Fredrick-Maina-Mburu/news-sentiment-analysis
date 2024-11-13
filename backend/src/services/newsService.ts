import axios from "axios";
import dotenv from "dotenv";
import { saveNewsToDB } from "./saveNewstoDB";


dotenv.config();

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NYT_API_URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json`;
const GUARDIAN_API_URL = `https://content.guardianapis.com/search`;

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NYT_API_KEY = process.env.NYT_API_KEY;
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;

// Fetch news from News API
export const fetchNewsAPI = async (query: string) => {
  const response = await axios.get(NEWS_API_URL, {
    params: {
      q: query,
      apiKey: NEWS_API_KEY,
      language: "en",
      sortBy: "publishedAt",
      pageSize: 5,
    },
  });
  return response.data.articles.map((article: any) => ({
    title: article.title,
    source: article.source.name,
    publishedAt: article.publishedAt,
    content: article.content,
    url: article.url,
    industry: query,
  }));
};

// Fetch news from the New York Times API
export const fetchNYTAPI = async (query: string) => {
  const response = await axios.get(NYT_API_URL, {
    params: {
      q: query,
      "api-key": NYT_API_KEY,
      sort: "newest",
      language: "en",
    },
  });

  return response.data.response.docs.map((article: any) => ({
    title: article.headline.main,
    source: "The New York Times",
    publishedAt: article.pub_date,
    content: article.abstract || article.lead_paragraph,
    url: article.web_url,
    industry: query,
  }));
};

// Fetch news from The Guardian API
export const fetchGuardianAPI = async (query: string) => {
  const response = await axios.get(GUARDIAN_API_URL, {
    params: {
      q: query,
      "api-key": GUARDIAN_API_KEY,
      "order-by": "newest",
      "page-size": 5,
      lang: "en",
    },
  });

  return response.data.response.results.map((article: any) => ({
    title: article.webTitle,
    source: "The Guardian",
    publishedAt: article.webPublicationDate,
    content: article.fields?.trailText || "",
    url: article.webUrl,
    industry: query,
  }));
};


export const fetchAndSaveNews = async () => {
  const queries = ['technology', 'finance', 'business'];

  for (const query of queries) {
    const allArticles: any[] = [];

    try {
      // fetch from all APIs
      const newsAPIArticles = await fetchNewsAPI(query);
      const nyTimesArticles = await fetchNYTAPI(query);
      const guardianArticles = await fetchGuardianAPI(query);

      // Combine all articles
      allArticles.push(...newsAPIArticles, ...nyTimesArticles, ...guardianArticles);
    } catch (error) {
      console.error(`Error fetching news for query "${query}":`, error);
    }

    // Save all the data to the DB
    if (allArticles.length > 0) {
      await saveNewsToDB(allArticles);
    }
  }
};


