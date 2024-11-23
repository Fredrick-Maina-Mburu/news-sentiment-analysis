import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, NewsItem, Subscription, SentimentScore, UserDetails, UserOnlyDetails } from '../types/index';

const API_BASE_URL = 'http://localhost:3005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       sessionStorage.clear();
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('username', data.name);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

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
    const { data } = await api.get('/subscribe/me');
    return data;
  },

  addSubscription: async (industry: string): Promise<Subscription> => {
    const { data } = await api.post('/subscribe/add', { industry });
    return data;
  },

  deleteSubscription: async (subscription_id: string): Promise<void> => {
    await api.delete(`/subscribe/delete/${subscription_id}`);
  }
};

export const sentimentApi = {
  getSentimentScores: async (): Promise<SentimentScore[]> => {
    const { data } = await api.get('/sentiments/');
    return data;
  }
};

export const UserApi = {
  deleteUserAccount: async () => {
    const { data } = await api.delete('/user/delete');
    return data;
  },
  getUserDetails: async (): Promise<UserDetails[]> => {
    const { data } = await api.get('/user/get');
    return data;
  },
  getOnlyUserDetails: async (): Promise<UserOnlyDetails[]> => {
    const { data } = await api.get('/user/get/me');
    return data;
  },

};

export default api;