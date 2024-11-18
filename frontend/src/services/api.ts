import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, NewsItem, Subscription } from '../types/index';

const API_BASE_URL = 'http://localhost:3005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['auth-token'] = token;
  }
  return config;
});

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export const newsApi = {
  getAllNews: async (): Promise<NewsItem[]> => {
    const { data } = await api.get('/news/');
    return data;
  },

  getNewsByTopic: async (topic: string): Promise<NewsItem[]> => {
    const { data } = await api.get(`/news/update?topic=${topic}`);
    return data;
  }
};

export const subscriptionApi = {
  getSubscriptions: async (): Promise<Subscription[]> => {
    const { data } = await api.get('/subscriptions/me');
    return data;
  },

  addSubscription: async (topic: string): Promise<Subscription> => {
    const { data } = await api.post('/subscriptions/add', { topic });
    return data;
  },

  deleteSubscription: async (subscriptionId: string): Promise<void> => {
    await api.delete(`/subscriptions/delete/${subscriptionId}`);
  }
};

export default api;