import React, { useState, useEffect } from "react";
import { subscriptionApi, sentimentApi } from "../services/api";
import { Subscription, SentimentScore } from "../types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const topics = [
  "technology",
  "finance",
  "health",
  "sports",
  "education",
  "business",
];

const SubscriptionPage: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, logout, username } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [sentimentScores, setSentimentScores] = useState<SentimentScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await subscriptionApi.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const fetchSentimentScores = async () => {
    try {
      const data = await sentimentApi.getSentimentScores();
      setSentimentScores(data);
    } catch (err) {
      console.error("Failed to load sentiment scores:", err);
    }
  };

  const handleAddSubscription = async () => {
    if (!selectedTopic) {
      setError("Please select a topic");
      return;
    }

    // Check if already subscribed
    const isAlreadySubscribed = subscriptions.some(
      (sub) => sub.industry === selectedTopic
    );

    if (isAlreadySubscribed) {
      setError(`You are already subscribed to ${selectedTopic}`);
      return;
    }

    setLoading(true);
    try {
      await subscriptionApi.addSubscription(selectedTopic);
      await fetchSubscriptions();
      setSelectedTopic("");
      setError(null);
    } catch (err) {
      setError("Failed to add subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (subscription_id: string) => {
    setLoading(true);
    try {
      await subscriptionApi.deleteSubscription(subscription_id);
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.subscription_id !== subscription_id)
      );
    } catch (err) {
      setError("Failed to delete subscription");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchSentimentScores();
  }, []);

  const getSentimentDataForChart = () => {
    if (!Array.isArray(sentimentScores) || sentimentScores.length === 0) {
      return { labels: [], datasets: [] };
    }

    const uniqueSentimentMap = new Map<
      string,
      { [industry: string]: number }
    >();

    // Determine if the range is less than a month
    const allDates = sentimentScores
      .map((score) => new Date(score.published_at))
      .sort((a, b) => a.getTime() - b.getTime());

    const dateRange =
      allDates[allDates.length - 1].getTime() - allDates[0].getTime();
    const lessThanMonth = dateRange < 30 * 24 * 60 * 60 * 1000;

    // Process sentiment scores to keep only the most recent score for each industry on a date
    sentimentScores.forEach((score) => {
      const formattedDate = lessThanMonth
        ? new Date(score.published_at).toISOString().split("T")[0]
        : `${new Date(score.published_at).getFullYear()}-${String(
            new Date(score.published_at).getMonth() + 1
          ).padStart(2, "0")}`;

      if (!uniqueSentimentMap.has(formattedDate)) {
        uniqueSentimentMap.set(formattedDate, {});
      }

      const dateData = uniqueSentimentMap.get(formattedDate)!;
      dateData[score.industry] = score.score;
    });

    // Get unique labels sorted
    const formattedDates = Array.from(uniqueSentimentMap.keys()).sort();

    // Color coding for specific lines
    const colorMap: { [key: string]: string } = {
      finance: "#FF6384",
      technology: "#36A2EB",
      health: "#FFCE56",
      education: "#4BC0C0",
      sports: "#9966FF",
      business: "#FF9F40",
    };

    // Prepare datasets
    const datasets = subscriptions.map((sub) => ({
      label: sub.industry,
      data: formattedDates.map(
        (date) => uniqueSentimentMap.get(date)![sub.industry] ?? null
      ),
      borderColor: colorMap[sub.industry] || "#000000",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      tension: 0.4,
      spanGaps: true,
    }));

    return { labels: formattedDates, datasets };
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text:
            getSentimentDataForChart().datasets.length > 0
              ? getSentimentDataForChart().labels.length < 30
                ? "Days"
                : "Months"
              : "",
        },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Sentiment Score" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            tooltipItem.raw !== null
              ? `Score: ${tooltipItem.raw}`
              : "No Data Available",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Manage Subscriptions
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="topic-select"
            className="block text-lg font-medium mb-2"
          >
            Add a New Subscription:
          </label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddSubscription}
            disabled={loading}
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Adding..." : "Add Subscription"}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
        {loading ? (
          <p className="text-center text-blue-500">Loading...</p>
        ) : subscriptions.length > 0 ? (
          <ul className="space-y-2">
            {subscriptions.map((sub) => (
              <li
                key={sub.subscription_id}
                className="flex justify-between items-center border rounded-lg p-4 shadow-sm"
              >
                <span>{sub.industry}</span>
                <button
                  onClick={() => handleDeleteSubscription(sub.subscription_id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No subscriptions yet.</p>
        )}
      </div>

      {/* Sentiment Dashboard */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-center mb-4">
          Sentiment Trends
        </h2>
        {sentimentScores.length ? (
          <Line data={getSentimentDataForChart()} options={options} />
        ) : (
          <p className="text-center text-gray-500">
            No sentiment data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
