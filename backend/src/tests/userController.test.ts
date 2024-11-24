import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes';
import pool from '../config/db';

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const app = express();
app.use(cookieParser());
app.use('/api/user', userRoutes);

describe('User Routes', () => {
  const mockUserId = '123';
  const mockSecret = 'test-secret';
  let validToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = mockSecret;
    validToken = jwt.sign({ user_id: mockUserId }, mockSecret);
  });

  describe('Authentication Middleware', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/api/user/get');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Access denied' });
    });

    it('should return 400 if invalid token is provided', async () => {
      const response = await request(app)
        .get('/api/user/get')
        .set('Cookie', ['token=invalid-token']);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid token' });
    });

    it('should return 500 if JWT_SECRET is missing', async () => {
      delete process.env.JWT_SECRET;
      const response = await request(app)
        .get('/api/user/get')
        .set('Cookie', [`token=${validToken}`]);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Secret missing from the env files' });
    });

    it('should pass authentication with valid token', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      
      const response = await request(app)
        .get('/api/user/get')
        .set('Cookie', [`token=${validToken}`]);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /user/get', () => {
    it('should return user details with subscription info', async () => {
      const mockUserData = {
        rows: [{
          user_id: mockUserId,
          name: 'Test User',
          email: 'test@example.com',
          industry: 'Technology'
        }]
      };
      
      (pool.query as jest.Mock).mockResolvedValueOnce(mockUserData);

      const response = await request(app)
        .get('/api/user/get')
        .set('Cookie', [`token=${validToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserData.rows);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT u.*, s.industry FROM users'),
        [mockUserId]
      );
    });

    it('should handle database errors', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/user/get')
        .set('Cookie', [`token=${validToken}`]);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error getting user' });
    });
  });

  describe('GET /user/get/me', () => {
    it('should return limited user details', async () => {
      const mockUserData = {
        rows: [{
          name: 'Test User',
          email: 'test@example.com',
          created_at: '2024-01-01'
        }]
      };
      
      (pool.query as jest.Mock).mockResolvedValueOnce(mockUserData);

      const response = await request(app)
        .get('/api/user/get/me')
        .set('Cookie', [`token=${validToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserData.rows);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT name, email, created_at FROM users'),
        [mockUserId]
      );
    });

    it('should handle database errors', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/user/get/me')
        .set('Cookie', [`token=${validToken}`]);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error getting user' });
    });
  });

  describe('DELETE /user/delete', () => {
    it('should delete user successfully', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .delete('/api/user/delete')
        .set('Cookie', [`token=${validToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted successfully' });
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM users'),
        [mockUserId]
      );
    });

    it('should handle database errors during deletion', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .delete('/api/user/delete')
        .set('Cookie', [`token=${validToken}`]);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error deleting user' });
    });
  });
});