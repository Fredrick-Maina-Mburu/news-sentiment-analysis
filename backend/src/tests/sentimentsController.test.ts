import { Request, Response } from 'express';
import { fetchSentiments } from '../controllers/sentimentsController';
import { fetchAllSentimentsFromDB } from '../services/fetchSentiments';


jest.mock('../services/fetchSentiments');

describe('Sentiments Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockSentiments = [
    {
      industry: 'technology',
      published_at: '2024-01-01',
      score: 0.75
    },
    {
      industry: 'finance',
      published_at: '2024-01-01',
      score: 0.65
    }
  ];

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSentiments', () => {
    it('should fetch all sentiments successfully', async () => {
      // Arrange
      (fetchAllSentimentsFromDB as jest.Mock).mockResolvedValue(mockSentiments);

      // Act
      await fetchSentiments(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(fetchAllSentimentsFromDB).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSentiments);
    });

    it('should handle empty results', async () => {
      // Arrange
      (fetchAllSentimentsFromDB as jest.Mock).mockResolvedValue([]);

      // Act
      await fetchSentiments(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(fetchAllSentimentsFromDB).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should handle null results', async () => {
      // Arrange
      (fetchAllSentimentsFromDB as jest.Mock).mockResolvedValue(null);

      // Act
      await fetchSentiments(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(fetchAllSentimentsFromDB).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(null);
    });

    it('should handle database errors properly', async () => {
      // Arrange
      const error = new Error('Database error');
      (fetchAllSentimentsFromDB as jest.Mock).mockRejectedValue(error);

      // Act
      await fetchSentiments(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error fetching sentiments'
      });
    });

    it('should handle database connection errors', async () => {
      // Arrange
      const error = new Error('Connection refused');
      (fetchAllSentimentsFromDB as jest.Mock).mockRejectedValue(error);

      // Act
      await fetchSentiments(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error fetching sentiments'
      });
    });
  });

  describe('fetchAllSentimentsFromDB data format', () => {
    it('should return properly formatted sentiment data', async () => {
      // Arrange
      const formattedSentiments = [
        {
          industry: 'technology',
          published_at: '2024-01-01',
          score: 0.75
        }
      ];
      (fetchAllSentimentsFromDB as jest.Mock).mockResolvedValue(formattedSentiments);

      // Act
      await fetchSentiments(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          industry: expect.any(String),
          published_at: expect.any(String),
          score: expect.any(Number)
        })
      ]));
    });

    it('should handle sentiment scores within valid range', async () => {
      // Arrange
      const sentimentsWithScores = [
        {
          industry: 'technology',
          published_at: '2024-01-01',
          score: 0.75
        },
        {
          industry: 'finance',
          published_at: '2024-01-01',
          score: -0.5
        }
      ];
      (fetchAllSentimentsFromDB as jest.Mock).mockResolvedValue(sentimentsWithScores);

      // Act
      await fetchSentiments(mockRequest as Request, mockResponse as Response);

      // Assert
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      response.forEach((sentiment: any) => {
        expect(sentiment.score).toBeGreaterThanOrEqual(-1);
        expect(sentiment.score).toBeLessThanOrEqual(1);
      });
    });
  });
});