import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ResetPassword from './page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ResetPassword Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders the Reset Password form', () => {
    render(<ResetPassword params={{ token: 'test-token' }} />);

    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Reset Password/i })
    ).toBeInTheDocument();
  });

  it('updates password state on input change', () => {
    render(<ResetPassword params={{ token: 'test-token' }} />);

    const passwordInput = screen.getByPlaceholderText(
      'New Password'
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });

    expect(passwordInput.value).toBe('newpassword123');
  });

  it('calls fetch and router.push on form submission with correct payload', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({}) })
    ) as jest.Mock;

    render(<ResetPassword params={{ token: 'test-token' }} />);

    const passwordInput = screen.getByPlaceholderText('New Password');
    const submitButton = screen.getByRole('button', {
      name: /Reset Password/i,
    });

    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/reset/test-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'newpassword123' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/auth/signin');
    });
  });
});
