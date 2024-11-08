// __tests__/auth.test.ts
import SignIn from '@/app/auth/signin/page';
import SignUp from '@/app/auth/signup/page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SessionProvider, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signIn: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mocking the useRouter function to prevent the router error
const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
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
