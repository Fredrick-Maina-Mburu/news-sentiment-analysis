import { Request, Response } from 'express';

export const getNews = async (req: Request, res: Response) => {
  res.json({ message: "News route is working!" });
};
