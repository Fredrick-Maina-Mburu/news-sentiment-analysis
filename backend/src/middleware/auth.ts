import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "../types/User";

interface CustomRequest extends Request {
  user?: JWTPayload;
}

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token  = req.cookies.token;
  const secret = process.env.JWT_SECRET;

  if (!token) {
    res.status(401).json({ message: "Access denied" });
  } else if(!secret){
    res.status(500).json({ message: "Secret missing from the env files" });
  } else {
    try {      
      const verified = jwt.verify(token, secret);
      req.user = verified as JWTPayload;
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  }
};
