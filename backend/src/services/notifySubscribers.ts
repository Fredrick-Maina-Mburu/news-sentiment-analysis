import transporter from "../config/nodemailerConfig";
import { getSubscribersByTopic } from "./subscriptionService"; // Fetch subscribers for a topic

export const notifySubscribers = async (topic: string, articles: any[]) => {
  const subscribers = await getSubscribersByTopic(topic);

  if (subscribers.length === 0) return;

  const emailBody = `
    <h3>Latest News for ${topic}</h3>
    <ul>
      ${articles.map(article => `
        <li>
          <strong>${article.title}</strong><br />
          Source: ${article.source}<br />
          Sentiment Score: ${(article.score * 100).toFixed(2)}% - ${article.sentiment}<br />
          Published: ${new Date(article.published_at).toLocaleString()}<br />
          <a href="${article.url}">Read more</a>
        </li>
      `).join('')}
    </ul>
  `;

  for (const subscriber of subscribers) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: subscriber.email,
        subject: `Latest ${topic} News Updates`,
        html: emailBody,
      });
      console.log(`Notification sent to ${subscriber.email} for topic ${topic}`);
    } catch (error) {
      console.error(`Error sending notification to ${subscriber.email}:`, error);
    }
  }
};
