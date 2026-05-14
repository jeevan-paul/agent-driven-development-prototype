import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider, createStore } from 'jotai';
import Sidebar from './Sidebar';
import { authUserAtom } from '../../atoms/authAtom';
import { sidebarOpenAtom } from '../../atoms/uiAtom';

function renderSidebar(open = true) {
  const store = createStore();
  store.set(sidebarOpenAtom, open);
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
        <Sidebar />
      </MemoryRouter>
    </Provider>
  );
}

describe('Sidebar', () => {
  it('renders Dashboard and My Profile nav items', () => {
    renderSidebar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  it('does not render Propose a Change in the sidebar', () => {
    renderSidebar();
    expect(screen.queryByText('Propose a Change')).not.toBeInTheDocument();
  });
});
