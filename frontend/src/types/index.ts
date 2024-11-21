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
  news_id:number;
  title: string;
  source: string;
  url: string;
  score: number;
  sentiment: string;
  industry: string;
  published_at: string;
}

export interface Subscription {
  subscription_id: string;
  industry: string;
  user_id: string;
  created_at: string;
}
export interface SentimentScore {
  industry: string;
  score: number;
  sentiment: string; 
  published_at: string; 
}

export interface UserDetails {
  name: string;
  email: string;
  created_at: Date;
  industry: string[];
}


export interface ApiError {
  message: string;
  status?: number;
}