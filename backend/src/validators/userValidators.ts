import { checkSchema } from 'express-validator';

// Validation schema for the register endpoint
export const registerSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email'
    },
    normalizeEmail: true
  },
  password: {
    matches: {
      options: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/],
      errorMessage: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
    }
  },
  name: {
    notEmpty: {
      errorMessage: 'Name is required'
    }
  }
});

// Validation schema for the login endpoint
export const loginSchema = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email'
    },
    normalizeEmail: true
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required'
    }
  }
});
