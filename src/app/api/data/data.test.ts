import { JSON_PLACEHOLDER_HOST, POSTS_URL } from '@/constants/constants';
import { createMocks } from 'node-mocks-http';
import handler from './route'; // adjust the path to your API handler

describe('API Handler Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and data when the fetch is successful', async () => {
    const mockResponseData = [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
    ];

    // Mocking fetch to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponseData),
      })
    ) as jest.Mock;

    // Create mock request and response
    const { req, res } = createMocks();

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ data: mockResponseData });
    expect(global.fetch).toHaveBeenCalledWith(
      JSON_PLACEHOLDER_HOST + POSTS_URL
    );
  });

  it('should return 500 if the fetch fails with a server error', async () => {
    // Mocking fetch to return a failed response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    const { req, res } = createMocks();

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to fetch data',
    });
  });

  it('should return 500 if there is a fetch exception', async () => {
    // Mocking fetch to throw an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network Error'))
    ) as jest.Mock;

    const { req, res } = createMocks();

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error',
    });
  });
});
