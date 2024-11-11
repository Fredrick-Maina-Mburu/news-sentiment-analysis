import { fetchNewsAPI, fetchNYTAPI, fetchGuardianAPI } from './newsService';

// Fetch news from all APIs
export const fetchAllNews = async (query: string) => {
  const [newsAPIArticles, nytArticles, guardianArticles] = await Promise.all([
    fetchNewsAPI(query),
    fetchNYTAPI(query),
    fetchGuardianAPI(query),
  ]);

  // Combine the news and remove duplicates by URL
  const combinedArticles = [
    ...newsAPIArticles,
    ...nytArticles,
    ...guardianArticles,
  ];
  const uniqueArticles = combinedArticles.filter(
    (article, index, self) =>
      index === self.findIndex((a) => a.url === article.url)
  );

  return uniqueArticles;
};