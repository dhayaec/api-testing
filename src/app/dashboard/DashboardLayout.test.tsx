import { fireEvent, render, screen } from '@testing-library/react';
import { signOut, useSession } from 'next-auth/react';
import DashboardLayout from './layout';

// Mocking next-auth/react module
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('DashboardLayout', () => {
  it('renders correctly when session exists', () => {
    // Mock session data
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com',
        },
      },
    });

    // Render the DashboardLayout
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    // Check if user details and Sign Out button are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText('John Doe (johndoe@example.com)')
    ).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('does not render user details or Sign Out button when session is absent', () => {
    // Mock absence of session data
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });

    // Render the DashboardLayout
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    // Check that the Sign Out button and user details are not rendered
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Content')).toBeInTheDocument();
  });

  it('calls signOut when Sign Out button is clicked', () => {
    // Mock session data
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com',
        },
      },
    });

    // Render the DashboardLayout
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    // Click the Sign Out button
    fireEvent.click(screen.getByText('Sign Out'));

    // Check that signOut was called
    expect(signOut).toHaveBeenCalled();
  });
});
