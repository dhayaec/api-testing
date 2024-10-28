// __tests__/Home.test.tsx
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { JSON_PLACEHOLDER_HOST, POSTS_URL } from '../constants/constants';
import { metadata } from './layout';
import Home from './page';

describe('Home Component', () => {
  it('renders posts data successfully', async () => {
    render(<Home />);

    // Check that "Loading..." is displayed initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for posts to be rendered
    await waitFor(() => {
      expect(screen.getByText('Posts')).toBeInTheDocument();
    });

    // Check that post titles are rendered
    expect(screen.getByText('Mocked Post 1')).toBeInTheDocument(); // Assuming post title in mocked data
    expect(screen.getByText('Mocked Post 2')).toBeInTheDocument();
  });

  it('renders error message when server returns 500', async () => {
    // Mock the server to return a 500 response
    server.use(
      http.get(JSON_PLACEHOLDER_HOST + POSTS_URL, () => {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Internal Server Error',
        });
      })
    );

    render(<Home />);

    expect(metadata.title).not.toBeNull();

    // Check that "Loading..." is displayed initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/i)).toBeInTheDocument();
    });
  });

  // it('renders error message on network error', async () => {
  //   // Mock the server to return a network error
  //   server.use(
  //     http.get(JSON_PLACEHOLDER_HOST + POSTS_URL, () => {
  //       return HttpResponse.json(null, { statusText: 'Failed to connect' });
  //     })
  //   );

  //   render(<Home />);

  //   // Check that "Loading..." is displayed initially
  //   expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

  //   // Wait for the network error message to appear
  //   await waitFor(() => {
  //     expect(
  //       screen.getByText(/Error: Error fetching data/i)
  //     ).toBeInTheDocument();
  //   });
  // });
});
