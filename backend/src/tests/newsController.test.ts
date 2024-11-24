import { Request, Response } from 'express';
import { fetchByTopic, fetchNews } from '../controllers/newsController';
import { fetchNewsByIndustry, fetchAllNewsFromDB } from '../services/fetchAllNews';

// Mock the services
jest.mock('../services/fetchAllNews');

describe('News Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockNews = [
    {
      news_id: 1,
      title: 'Test News',
      industry: 'business',
      published_at: '2024-01-01',
      score: 0.8,
      sentiment: 'positive'
    }
  ];

  beforeEach(() => {
    mockRequest = {
      query: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchByTopic', () => {
    it('should fetch news by topic successfully', async () => {
      // Arrange
      const mockTopic = 'technology';
      mockRequest.query = { topic: mockTopic };
      (fetchNewsByIndustry as jest.Mock).mockResolvedValue(mockNews);

      // Act
      await fetchByTopic(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(fetchNewsByIndustry).toHaveBeenCalledWith(mockTopic);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNews);
    });

    it('should use default topic "business" when no topic is provided', async () => {
      // Arrange
      (fetchNewsByIndustry as jest.Mock).mockResolvedValue(mockNews);

      // Act
      await fetchByTopic(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(fetchNewsByIndustry).toHaveBeenCalledWith('business');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNews);
    });

    it('should handle errors properly', async () => {
      // Arrange
      const error = new Error('Database error');
      (fetchNewsByIndustry as jest.Mock).mockRejectedValue(error);

      // Act
      await fetchByTopic(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error updating news articles'
      });
    });
  });

  describe('fetchNews', () => {
    it('should fetch all news successfully', async () => {
      // Arrange
      (fetchAllNewsFromDB as jest.Mock).mockResolvedValue(mockNews);

      // Act
      await fetchNews(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(fetchAllNewsFromDB).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNews);
    });

    it('should handle errors properly', async () => {
      // Arrange
      const error = new Error('Database error');
      (fetchAllNewsFromDB as jest.Mock).mockRejectedValue(error);

      // Act
      await fetchNews(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error fetching news articles'
      });
    });
  });
});