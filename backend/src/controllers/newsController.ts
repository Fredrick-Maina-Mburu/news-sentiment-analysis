import { Request, Response } from 'express';
import { fetchNewsByIndustry, fetchAllNewsFromDB } from '../services/fetchAllNews';


export const fetchByTopic = async (req: Request, res: Response) => {
  try {
    const query = req.query.q || 'business';
    const articles = await fetchNewsByIndustry(query as string);

    res.status(200).json(articles);
  } catch (error) {
    console.log('Error :', error)
    res.status(500).json({ message: 'Error updating news articles' });
  }
};

export const fetchNews = async (req: Request, res: Response) => {
  try {
    const articles = await fetchAllNewsFromDB();

    res.status(200).json(articles);
  } catch (error) {
    console.log('Error :', error)
    res.status(500).json({ message: 'Error fetching news articles' });
  }
}
