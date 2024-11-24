const mockQuery = jest.fn();
const mockPool = {
  query: mockQuery,
};

export const query = mockQuery;
export default mockPool;

