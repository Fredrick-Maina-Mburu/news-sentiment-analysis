// import { JWTPayload } from './User';

declare namespace Express {
  export interface Request {
    user?: JWTPayload;
  }
}