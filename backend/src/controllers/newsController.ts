import { Request, Response } from 'express';
import { fetchAllNews } from '../services/fetchAllNews';
import { saveNewsToDB } from '../services/saveNewstoDB';

export const updateNews = async (req: Request, res: Response) => {
  try {
    const query = req.query.q || 'business';
    const articles = await fetchAllNews(query as string);

    await saveNewsToDB(articles);

    res.status(200).json({ message: 'News articles updated successfully from multiple sources.' });
  } catch (error) {
    console.log('Error :', error)
    res.status(500).json({ message: 'Error updating news articles' });
  }
};
