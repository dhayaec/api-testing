import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from './page';

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Forgot Password form', () => {
    render(<ForgotPassword />);

    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Send Reset Link/i })
    ).toBeInTheDocument();
  });

  it('updates email state on input change', () => {
    render(<ForgotPassword />);

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('calls fetch on form submission with correct payload', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({}) })
    ) as jest.Mock;

    render(<ForgotPassword />);

    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', {
      name: /Send Reset Link/i,
    });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });
    });
  });
});
