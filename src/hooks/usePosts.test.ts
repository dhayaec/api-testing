import { JSON_PLACEHOLDER_HOST, POSTS_URL } from '@/constants/constants';
import { renderHook } from '@testing-library/react-hooks';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import usePosts from './usePosts';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('usePosts', () => {
  it('should fetch posts successfully', async () => {
    server.use(
      http.get(`${JSON_PLACEHOLDER_HOST}${POSTS_URL}`, () => {
        return HttpResponse.json([
          { id: 1, title: 'Post 1', body: 'Body 1' },
          { id: 2, title: 'Post 2', body: 'Body 2' },
        ]);
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => usePosts());

    await waitForNextUpdate();

    expect(result.current.data).toEqual([
      { id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, title: 'Post 2', body: 'Body 2' },
    ]);
    expect(result.current.error).toBeNull();
  });

  it('should handle network errors', async () => {
    const expectedError = 'Error fetching data';
    server.use(
      http.get(`${JSON_PLACEHOLDER_HOST}${POSTS_URL}`, () => {
        return HttpResponse.text(expectedError, { status: 500 });
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => usePosts());

    await waitForNextUpdate();

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(expectedError);
  });

  it('should handle unexpected errors', async () => {
    const expectedError = 'Error fetching data';
    server.use(
      http.get(`${JSON_PLACEHOLDER_HOST}${POSTS_URL}`, () => {
        return HttpResponse.text(expectedError, { status: 404 });
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => usePosts());

    await waitForNextUpdate();

    expect(result.current.data).toBeUndefined();
    return HttpResponse.text(expectedError, { status: 404 });
  });
});
