import pool from "../config/db";
import { Request, Response } from "express";
import { JWTPayload } from "../types/User";

interface CustomRequest extends Request {
  user?: JWTPayload;
}
export const deleteUser = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (req.user) {
    const user = req.user as JWTPayload;
    const user_id = user.user_id;
    try {
      const result = await pool.query("DELETE FROM users WHERE user_id = $1", [
        user_id,
      ]);
      res.status(200).json({ message: "User deleted successfully" });
      return;
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  }
};

export const getUserDetails = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (req.user) {
    const user = req.user as JWTPayload;
    const user_id = user.user_id;
    try {
      const result = await pool.query(
        "SELECT u.*, s.industry FROM users u INNER JOIN subscriptions s ON u.user_id = s.user_id WHERE u.user_id = $1",
        [user_id]
      );
      res.status(200).json(result.rows);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error getting user" });
    }
  }
};

export const getOnlyUserDetails = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  if (req.user) {
    const user = req.user as JWTPayload;
    const user_id = user.user_id;
    try {
      const result = await pool.query(
        "SELECT name, email, created_at FROM users WHERE user_id = $1",
        [user_id]
      );
      res.status(200).json(result.rows);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error getting user" });
    }
  }
};
