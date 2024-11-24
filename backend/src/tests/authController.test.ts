import request from 'supertest';
import app from '../app';
import pool from '../config/db';
import { validationResult } from 'express-validator';

describe('AuthController Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    // Mock validation success
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => true,
      array: () => []
    });

    // Mock the database queries
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [] }) // Email check query
      .mockResolvedValueOnce({ 
        rows: [{
          user_id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }]
      }); // Insert user query

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
        name: 'Test User'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toEqual({
      user_id: 1,
      email: 'test@example.com',
      name: 'Test User'
    });
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  it('should fail with validation errors', async () => {
    // Mock validation failure
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{
        msg: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
      }]
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should fail if email already exists', async () => {
    // Mock validation success
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => true,
      array: () => []
    });

    // Mock existing user
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ email: 'test@example.com' }]
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
        name: 'Test User'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Email is already registered');
  });

  it('should fail with invalid password format', async () => {
    // Mock validation failure specific to password
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{
        msg: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
      }]
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toContain('Password must be');
  });
});


describe('User Validation Rules', () => {
  // validation rules for user registration
  it('should validate password format', async () => {
    // Mock validation failure for password
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{
        msg: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
      }]
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toMatch(/Password must be/);
  });

  it('should validate insertion of legit email', async () => {
    // Mock validation failure for email
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{
        msg: 'Please provide a valid email'
      }]
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testexample.com',
        password: 'weak',
        name: 'Test User'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toMatch("Please provide a valid email");
  });

  it('should validate insertion of a name', async () => {
    // Mock validation failure for name
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{
        msg: 'Name is required'
      }]
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testexample.com',
        password: 'weak',
        name: ''
      });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toMatch("Name is required");
  });

  // validation rules for user login
  it('should validate email format', async () => {
    // Mock validation failure for email
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{
        msg: 'Please provide a valid email'
      }]
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testexample.com',
        password: 'weak'
      });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toMatch("Please provide a valid email");
  });

  it('should validate password', async () => {
    // Mock validation failure for password
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{
        msg: 'Password is required'
      }]
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: ''
      });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toMatch("Password is required");
    });
});