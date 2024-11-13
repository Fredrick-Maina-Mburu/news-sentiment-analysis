import cron from 'node-cron';
import { fetchAndSaveNews } from './newsService';

// Schedule to fetch news every 6 hours
const scheduleNewsFetching = () => {
  cron.schedule('* */1 * * *', async () => {
    console.log('Starting scheduled news fetch and analysis...');
    
    try {
      // Fetch and save news
      await fetchAndSaveNews();
      console.log('News fetch and analysis completed successfully.');
    } catch (error) {
      console.error('Error during scheduled news fetch:', error);
    }
  });
};

export default scheduleNewsFetching;
