import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider, createStore } from 'jotai';
import Header from './Header';
import { authUserAtom } from '../../atoms/authAtom';

function renderHeader() {
  const store = createStore();
  store.set(authUserAtom, {
    id: '1',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    role: 'Employee',
    department: 'Engineering',
    avatarInitials: 'AM',
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Header title="Dashboard" />
      </MemoryRouter>
    </Provider>
  );
}

describe('Header profile menu', () => {
  it('shows Propose a Change item when profile menu is opened', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Propose a Change')).toBeInTheDocument();
  });

  it('shows Sign out item when profile menu is opened', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('renders Propose a Change above Sign out in the menu', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button'));

    const items = screen.getAllByRole('menuitem');
    const proposeIdx = items.findIndex((el) => el.textContent?.includes('Propose a Change'));
    const signOutIdx = items.findIndex((el) => el.textContent?.includes('Sign out'));

    expect(proposeIdx).toBeGreaterThanOrEqual(0);
    expect(signOutIdx).toBeGreaterThan(proposeIdx);
  });
});
