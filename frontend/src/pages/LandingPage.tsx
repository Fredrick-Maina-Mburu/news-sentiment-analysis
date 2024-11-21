import React, { useState, useEffect } from "react";
import { NewsItem } from "../types";
import { newsApi } from "../services/api";

const industries = ["technology", "finance", "health", "sports", "education"];

const LandingPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all news
  const fetchAllNews = async () => {
    setLoading(true);
    try {
      const response = await newsApi.getAllNews();
      setNews(response);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch news by industry
  const fetchByIndustry = async (industry: string) => {
    setLoading(true);
    try {
      const response = await newsApi.getNewsByTopic(industry);
      setNews(response);
    } catch (error) {
      console.error("Error fetching filtered news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const industry = event.target.value;
    setSelectedIndustry(industry);
    if (industry === "") {
      fetchAllNews();
    } else {
      fetchByIndustry(industry);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Latest News</h1>
        <div className="mb-6 flex justify-between items-center">
          <label htmlFor="industry-select" className="text-lg font-medium">
            Filter by Industry:
          </label>
          <select
            id="industry-select"
            value={selectedIndustry}
            onChange={handleIndustryChange}
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <p className="text-center text-blue-500">Loading news...</p>
        ) : news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.news_id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.industry}</p>
                <p className="mt-2 text-gray-700">Source: {item.source}</p>
                <p className="mt-2 text-gray-700">
                  Published: {new Date(item.published_at).toLocaleString()}
                </p>
                <p
                  className={`font-medium mt-2 ${
                    item.score > 0.05
                      ? "text-green-500"
                      : item.score < -0.05
                      ? "text-red-500"
                      : "text-orange-500"
                  }`}
                >
                  Sentiment Score: {(item.score * 100).toFixed(2)}% - {" "}
                  {item.sentiment}
                </p>
                <a className="text-blue-500 font-semibold mt-4 hover:underline" href={item.url} target="_blank">Read More</a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No news available.</p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
