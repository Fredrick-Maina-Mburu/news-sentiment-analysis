import React from "react";
import { NewsItem } from "../types";


const NewsCard: React.FC<NewsItem> = ({ title, source, publishedAt, sentimentScore, url, topic }) => {
  return (
    <div className="bg-white shadow-lg p-4 rounded-md border">
      <h2 className="font-bold text-lg">{title}</h2>
      <p className="text-sm text-gray-500">Source: {source}</p>
      <p className="text-sm text-gray-500">Published: {new Date(publishedAt).toLocaleString()}</p>
      <p className={`font-medium mt-2 ${sentimentScore > 0 ? "text-green-500" : "text-red-500"}`}>
        Sentiment Score: {sentimentScore}
      </p>
      <a href={url} className="text-blue-500 hover:underline mt-2 block" target="_blank">
        Read more
      </a>
    </div>
  );
};

export default NewsCard;
