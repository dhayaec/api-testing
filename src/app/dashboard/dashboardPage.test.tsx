import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Dashboard from './page';

jest.mock('next-auth/react');
jest.mock('next/navigation');

describe('Dashboard', () => {
  const mockUseSession = useSession as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush });
  });

  it('redirects to /auth/signin if unauthenticated', async () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<Dashboard />);

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/auth/signin'));
  });

  it('displays loading message when session status is loading', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });

    render(<Dashboard />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders user information when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'John Doe', email: 'john@example.com' } },
      status: 'authenticated',
    });

    render(<Dashboard />);

    expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument();
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
  });
});
