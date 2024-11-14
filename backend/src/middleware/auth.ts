import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "../types/User";

interface CustomRequest extends Request {
  user?: JWTPayload;
}

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("auth-token") as string;
  const secret = process.env.JWT_SECRET;

  if (!token) {
    res.status(401).json({ message: "Access denied" });
  } else if(!secret){
    res.status(500).json({ message: "Secret missing from the env files" });
  } else {
    try {      
      const verified = jwt.verify(token, secret);
      req.user = verified as JWTPayload;
      console.log(req.user)
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  }
};
