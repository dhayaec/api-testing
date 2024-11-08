import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from './page';
import router from 'next/router';

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Sign Up form', () => {
    render(<SignUp />);

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  it('updates formData state on input change', () => {
    render(<SignUp />);

    const nameInput = screen.getByPlaceholderText('Name') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      'Password'
    ) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('johndoe@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls fetch and redirects to dashboard on successful sign up', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

    render(<SignUp />);

    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
        }),
      });
      expect(router.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
