export interface AuthResponse {
  token: string;
  user:{
    user_id: string;
    name: string;
    email: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  sentimentScore: number;
  topic: string;
  publishedAt: string;
}

export interface Subscription {
  id: string;
  topic: string;
  userId: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
}