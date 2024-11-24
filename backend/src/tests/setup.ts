import { jest } from '@jest/globals';
import { Server } from 'http';

declare global {
  var server: Server | undefined;
}

// Mock express-validator with checkSchema support
jest.mock('express-validator', () => ({
  checkSchema: jest.fn().mockReturnValue([
    (req: any, res: any, next: any) => next()
  ]),
  validationResult: jest.fn().mockReturnValue({ 
    isEmpty: () => true,
    array: () => []
  })
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn<() => Promise<string>>().mockResolvedValue('hashedPassword123'),
}));

// Mock the database
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

// Close server after tests
afterAll(done => {
  if (global.server) {
    global.server.close(done);
  } else {
    done();
  }
});