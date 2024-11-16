import cron from 'node-cron';
import { fetchAndSaveNews } from './newsService';

// Schedule to fetch news every 8 hours
const  scheduleNewsFetching = async () => {
  // try {
  //   console.log('initial news fetch...')
  //   await fetchAndSaveNews();
  //   console.log('Initial news fetch completed successfully.');
  // } catch (error) {
  //   console.error('Error during initial news fetch:', error);
  // }
  cron.schedule('0 */8 * * *', async () => {
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
