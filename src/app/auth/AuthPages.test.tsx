import { fireEvent, render, screen } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ForgotPassword from './forgot/page';
import ResetPassword from './reset/[token]/page';
import SignIn from './signin/page';
import SignUp from './signup/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

test('renders Forgot Password form', () => {
  render(<ForgotPassword />);
  expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
});

test('submits the form with email', async () => {
  render(<ForgotPassword />);
  const emailInput = screen.getByPlaceholderText(/Email/i);
  const submitButton = screen.getByText(/Send Reset Link/i);

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.click(submitButton);

  // Assert that fetch was called with the correct parameters
  expect(fetch).toHaveBeenCalledWith('/api/auth/forgot', expect.any(Object));
});

test('renders Reset Password form', () => {
  render(<ResetPassword params={{ token: 'test-token' }} />);
  expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument();
});

test('submits the form with new password', async () => {
  const pushMock = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

  render(<ResetPassword params={{ token: 'test-token' }} />);
  const passwordInput = screen.getByPlaceholderText(/New Password/i);
  const submitButton = screen.getByText(/Reset Password/i);

  fireEvent.change(passwordInput, { target: { value: 'newPassword' } });
  fireEvent.click(submitButton);

  expect(fetch).toHaveBeenCalledWith(
    `/api/auth/reset/test-token`,
    expect.any(Object)
  );
  expect(pushMock).toHaveBeenCalledWith('/auth/signin');
});

test('renders Sign In form', () => {
  render(<SignIn />);
  expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

test('submits the form and redirects on successful login', async () => {
  const pushMock = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

  (signIn as jest.Mock).mockResolvedValueOnce({ error: null });
  render(<SignIn />);

  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: 'password' },
  });
  fireEvent.click(screen.getByText(/Sign In/i));

  expect(signIn).toHaveBeenCalledWith('credentials', expect.any(Object));
  expect(pushMock).toHaveBeenCalledWith('/dashboard');
});

test('renders Sign Up form', () => {
  render(<SignUp />);
  expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

test('submits the form and redirects on successful signup', async () => {
  const pushMock = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as never;

  render(<SignUp />);
  fireEvent.change(screen.getByPlaceholderText(/Name/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: 'password' },
  });
  fireEvent.click(screen.getByText(/Sign Up/i));

  expect(global.fetch).toHaveBeenCalledWith(
    '/api/auth/signup',
    expect.any(Object)
  );
  expect(pushMock).toHaveBeenCalledWith('/dashboard');
});
