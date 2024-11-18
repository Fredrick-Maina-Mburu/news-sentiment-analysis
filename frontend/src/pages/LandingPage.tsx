import React, { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";

const LandingPage= () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3005/api/news/")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((error) => console.error("Error fetching news:", error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((article, index) => (
          <NewsCard
            key={index}
            title={article.title}
            source={article.source}
            publishedAt={article.published_at}
            sentimentScore={article.score}
            url={article.url}
            topic={article.topic}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
