import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';
import { getSubscriptions, addSubscription, deleteSubscription } from '../controllers/subscriptionControllers';
import pool from '../config/db';

jest.mock('../config/db', () => ({
  query: jest.fn()
}));

describe('Subscription System', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      cookies: {},
      body: {},
      params: {},
      user: undefined
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Middleware', () => {
    it('should return 401 if no token is provided', () => {
      auth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should return 500 if JWT_SECRET is missing', () => {
      process.env.JWT_SECRET = '';
      mockRequest.cookies = { token: 'valid-token' };

      auth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Secret missing from the env files' });
    });

    it('should call next() with valid token', () => {
      const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET!);
      mockRequest.cookies = { token };

      auth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.user_id).toBe(1);
    });

    it('should return 400 with invalid token', () => {
      mockRequest.cookies = { token: 'invalid-token' };

      auth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    });
  });

  describe('Subscription Controllers', () => {
    describe('getSubscriptions', () => {
      it('should fetch subscriptions successfully', async () => {
        const mockSubscriptions = [
          { subscription_id: 1, user_id: 1, industry: 'tech' }
        ];
        mockRequest.user = { user_id: 1 };
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockSubscriptions });

        await getSubscriptions(mockRequest as Request, mockResponse as Response);

        expect(pool.query).toHaveBeenCalledWith(
          'SELECT * FROM subscriptions WHERE user_id = $1',
          [1]
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockSubscriptions);
      });

      it('should handle database errors', async () => {
        mockRequest.user = { user_id: 1 };
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

        await getSubscriptions(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error fetching subscriptions' });
      });
    });

    describe('addSubscription', () => {
      it('should add subscription successfully', async () => {
        const newSubscription = { subscription_id: 1, user_id: 1, industry: 'tech' };
        mockRequest.user = { user_id: 1 };
        mockRequest.body = { industry: 'tech' };
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [newSubscription] });

        await addSubscription(mockRequest as Request, mockResponse as Response);

        expect(pool.query).toHaveBeenCalledWith(
          'INSERT INTO subscriptions (user_id, industry) VALUES ($1, $2) RETURNING *',
          [1, 'tech']
        );
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith([newSubscription]);
      });

      it('should handle database errors when adding subscription', async () => {
        mockRequest.user = { user_id: 1 };
        mockRequest.body = { industry: 'tech' };
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

        await addSubscription(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error adding subscription' });
      });
    });

    describe('deleteSubscription', () => {
      it('should delete subscription successfully', async () => {
        mockRequest.params = { subscription_id: '1' };
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ subscription_id: 1 }] });

        await deleteSubscription(mockRequest as Request, mockResponse as Response);

        expect(pool.query).toHaveBeenCalledWith(
          'DELETE FROM subscriptions WHERE subscription_id = $1 RETURNING *',
          ['1']
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Subscription deleted successfully' });
      });

      it('should handle database errors when deleting subscription', async () => {
        mockRequest.params = { subscription_id: '1' };
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

        await deleteSubscription(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error deleting subscription' });
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete subscription flow', async () => {
      // Setup
      const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET!);
      mockRequest.cookies = { token };
      mockRequest.user = { user_id: 1 };
      mockRequest.body = { industry: 'tech' };

      // Mock DB responses
      const newSubscription = { subscription_id: 1, user_id: 1, industry: 'tech' };
      
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [newSubscription] }) // addSubscription
        .mockResolvedValueOnce({ rows: [newSubscription] }) // getSubscriptions
        .mockResolvedValueOnce({ rows: [{ subscription_id: 1 }] }); // deleteSubscription

      // Add subscription
      await addSubscription(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(201);

      // Get subscriptions
      await getSubscriptions(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);

      // Delete subscription
      mockRequest.params = { subscription_id: '1' };
      await deleteSubscription(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});