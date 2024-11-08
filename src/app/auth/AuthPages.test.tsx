import { fireEvent, render, screen } from '@testing-library/react';
import { SessionProvider, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ForgotPassword from './forgot/page';
import ResetPassword from './reset/[token]/page';
import SignIn from './signin/page';
import SignUp from './signup/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signIn: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mocking the useRouter function to prevent the router error
const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

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

function renderWithSessionProvider(component: React.ReactNode) {
  return render(<SessionProvider>{component}</SessionProvider>);
}

describe('SignIn Flow', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  test('displays an error for incorrect credentials', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      error: 'Invalid email or password',
    });

    renderWithSessionProvider(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrong_password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(
      await screen.findByText(/Invalid email or password/)
    ).toBeInTheDocument();
  });

  test('redirects to dashboard on successful login', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    renderWithSessionProvider(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});

describe('SignUp Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // test('displays an error for invalid signup data', async () => {
  //   fetchMock.mockResponseOnce(JSON.stringify({ error: 'Signup failed' }), {
  //     status: 400,
  //   });

  //   renderWithSessionProvider(<SignUp />);

  //   fireEvent.change(screen.getByPlaceholderText('Name'), {
  //     target: { value: 'John Doe' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('Email'), {
  //     target: { value: 'invalid_email@' },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText('Password'), {
  //     target: { value: 'short' },
  //   });

  //   fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  //   expect(await screen.findByText(/Signup failed/)).toBeInTheDocument();
  // });

  test('redirects to dashboard on successful signup', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
      status: 200,
    });

    renderWithSessionProvider(<SignUp />);

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'strongpassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
