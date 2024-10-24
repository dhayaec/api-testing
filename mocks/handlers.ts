import { http, HttpResponse } from 'msw';
import postsData from './postsData';

export const handlers = [
  http.get('https://jsonplaceholder.typicode.com/users/1/posts', () => {
    return HttpResponse.json(postsData);
  }),
];
