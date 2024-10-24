import { JSON_PLACEHOLDER_HOST, POSTS_URL } from '@/constants/constants';
import { http, HttpResponse } from 'msw';
import postsData from './postsData';

export const handlers = [
  // Success response
  http.get(JSON_PLACEHOLDER_HOST + POSTS_URL, () => {
    return HttpResponse.json(postsData);
  }),

  // Server error (500)
  http.get(JSON_PLACEHOLDER_HOST + POSTS_URL, () => {
    return HttpResponse.json(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }),

  // Network error
  http.get(JSON_PLACEHOLDER_HOST + POSTS_URL, () => {
    return HttpResponse.json(null, { statusText: 'Failed to connect' });
  }),
];
