import { Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Register new user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, name, password } = req.body;
    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: "Email is already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, email, name`,
      [name, email, hashedPassword]
    );

    res.status(201).json({ user: result.rows[0] });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
    return;
  }
};

// User login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid password or email" });
      return;
    }
    const payload = {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1hr
    });
    res.status(200).json({
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to log in user" });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};
