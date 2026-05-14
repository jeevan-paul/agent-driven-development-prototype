import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'jotai';
import LoginPage from './LoginPage';

function renderLoginPage() {
  return render(
    <Provider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
}

describe('LoginPage — Use demo credentials button', () => {
  it('renders the "Use demo credentials" button', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /use demo credentials/i })).toBeInTheDocument();
  });

  it('fills email and password fields when button is clicked', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');

    fireEvent.click(screen.getByRole('button', { name: /use demo credentials/i }));

    expect(emailInput).toHaveValue('alex.morgan@company.com');
    expect(passwordInput).toHaveValue('password');
  });

  it('overwrites existing field values when button is clicked', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'other@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });

    fireEvent.click(screen.getByRole('button', { name: /use demo credentials/i }));

    expect(emailInput).toHaveValue('alex.morgan@company.com');
    expect(passwordInput).toHaveValue('password');
  });

  it('does not submit the form when clicking the autofill button', () => {
    renderLoginPage();

    fireEvent.click(screen.getByRole('button', { name: /use demo credentials/i }));

    expect(screen.queryByText(/signing in/i)).not.toBeInTheDocument();
  });

  it('clears any existing error when demo credentials are filled', async () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /^sign in$/i });

    fireEvent.change(emailInput, { target: { value: 'bad@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'badpass' } });

    await act(async () => {
      fireEvent.click(signInButton);
      await new Promise((r) => setTimeout(r, 900));
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /use demo credentials/i }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
