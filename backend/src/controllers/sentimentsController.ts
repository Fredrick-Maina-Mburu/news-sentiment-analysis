import { Request, Response } from 'express';
import { fetchAllSentimentsFromDB } from '../services/fetchSentiments';

export const fetchSentiments = async (req: Request, res: Response) => {
  try {
    const sentiments = await fetchAllSentimentsFromDB();

    res.status(200).json(sentiments);
  } catch (error) {
    console.log('Error :', error)
    res.status(500).json({ message: 'Error fetching sentiments' });
  }
}