import pool from "../config/db";
import { Request, Response } from "express";
import { JWTPayload } from "../types/User";

interface CustomRequest extends Request {
  user?: JWTPayload;
}

export const getSubscriptions = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (req.user) {
    const user = req.user as JWTPayload;
    const user_id = user.user_id;
    try {
      const result = await pool.query(
        "SELECT * FROM subscriptions WHERE user_id = $1",
        [user_id]
      );
      res.status(200).json(result.rows);
      return;
    } catch (error) {
      res.status(500).json({ error: "Error fetching subscriptions" });
      return;
    }
  }
};

export const addSubscription = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { industry } = req.body;
  if (req.user) {
    const user = req.user as JWTPayload;
    const user_id = user.user_id;
    try {
      const result = await pool.query(
        "INSERT INTO subscriptions (user_id, industry) VALUES ($1, $2) RETURNING *",
        [user_id, industry]
      );
      res.status(201).json(result.rows);
      return;
    } catch (error) {
      res.status(500).json({ error: "Error adding subscription" });
      return;
    }
  }
};

export const deleteSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { subscription_id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM subscriptions WHERE subscription_id = $1 RETURNING *",
      [subscription_id]
    );
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subscription" });
  }
};
