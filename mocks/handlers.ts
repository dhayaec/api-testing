import { JSON_PLACEHOLDER_HOST, POSTS_URL } from '@/constants/constants';
import bcrypt from 'bcryptjs';
import { http, HttpResponse } from 'msw';
import postsData from './postsData';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  password: bcrypt.hashSync('password123', 10),
};

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

  http.post('/api/auth/callback/credentials', async ({ request }) => {
    const info = await request.formData();
    const { email, password } = info as never;
    if (
      email === mockUser.email &&
      bcrypt.compareSync(password, mockUser.password)
    ) {
      return HttpResponse.json({ id: mockUser.id, email: mockUser.email });
    }

    return HttpResponse.json(null, {
      status: 500,
      statusText: 'Invalid email or password',
    });
  }),
];
