import { JSON_PLACEHOLDER_HOST, POSTS_URL } from '@/constants/constants';
import bcrypt from 'bcryptjs';
import { http, HttpResponse } from 'msw';
import postsData from './postsData';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  password: bcrypt.hashSync('password123', 10),
};

const mockSession = {
  user: {
    id: mockUser.id,
    email: mockUser.email,
  },
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

  // Signup handler
  http.post('/api/auth/signup', async ({ request }) => {
    const info = await request.formData();
    const { name, email, password } = info as never;

    // Basic validation
    if (!name || !email || !password) {
      return HttpResponse.json(null, {
        status: 400,
        statusText: 'All fields are required',
      });
    }

    // Simulate checking if the user already exists
    if (email === mockUser.email) {
      return HttpResponse.json(null, {
        status: 400,
        statusText: 'User already exists',
      });
    }

    // Create a new mock user
    const newUser = {
      id: '2',
      name,
      email,
      password: bcrypt.hashSync(password, 10), // Hash the password
    };

    // Normally, you would save this user in the database
    // For mocking, just return the new user info
    return HttpResponse.json(
      { success: true, userId: newUser.id },
      {
        status: 201,
      }
    );
  }),
  http.get('/api/auth/session', () => {
    // Simulate a successful session retrieval
    return HttpResponse.json(mockSession, {
      status: 200,
    });
  }),
];
