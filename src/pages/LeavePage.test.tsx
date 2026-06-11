import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider, createStore } from 'jotai';
import LeavePage from './LeavePage';
import { authUserAtom } from '../atoms/authAtom';
import { leaveTypesAtom } from '../atoms/leaveAtom';

function renderLeavePage() {
  const store = createStore();
  store.set(authUserAtom, {
    id: 'emp-001',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    role: 'Software Engineer',
    department: 'Engineering',
    avatarInitials: 'AM',
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LeavePage />
      </MemoryRouter>
    </Provider>,
  );
}

describe('LeavePage', () => {
  it('renders the leave balance heading', () => {
    renderLeavePage();
    expect(screen.getByText('Leave Balance')).toBeInTheDocument();
  });

  it('renders summary stat labels', () => {
    renderLeavePage();
    expect(screen.getByText('Total Balance Available')).toBeInTheDocument();
    expect(screen.getByText('Days Used')).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
  });

  it('renders the Leave Types section heading', () => {
    renderLeavePage();
    expect(screen.getByText('Leave Types')).toBeInTheDocument();
  });

  it('renders all four leave type cards', () => {
    renderLeavePage();
    expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    expect(screen.getByText('Casual Leave')).toBeInTheDocument();
    expect(screen.getByText('Sick Leave')).toBeInTheDocument();
    expect(screen.getByText('Emergency Leave')).toBeInTheDocument();
  });

  it('displays user name and department in the header', () => {
    renderLeavePage();
    expect(screen.getByText(/Alex Morgan/)).toBeInTheDocument();
    expect(screen.getByText(/Engineering/)).toBeInTheDocument();
  });

  it('shows correct available days for annual leave', () => {
    const store = createStore();
    store.set(authUserAtom, {
      id: 'emp-001',
      name: 'Test User',
      email: 'test@company.com',
      role: 'Engineer',
      department: 'Tech',
      avatarInitials: 'TU',
    });
    store.set(leaveTypesAtom, [
      { id: 'annual', name: 'Annual Leave', totalDays: 20, usedDays: 6, pendingDays: 0, color: '#085ED7' },
    ]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LeavePage />
        </MemoryRouter>
      </Provider>,
    );

    // Available = 20 - 6 = 14
    const available = screen.getAllByText('14');
    expect(available.length).toBeGreaterThan(0);
  });

  it('shows exhausted chip when no days remain', () => {
    const store = createStore();
    store.set(authUserAtom, {
      id: 'emp-001',
      name: 'Test User',
      email: 'test@company.com',
      role: 'Engineer',
      department: 'Tech',
      avatarInitials: 'TU',
    });
    store.set(leaveTypesAtom, [
      { id: 'annual', name: 'Annual Leave', totalDays: 5, usedDays: 5, pendingDays: 0, color: '#085ED7' },
    ]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LeavePage />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Exhausted')).toBeInTheDocument();
  });

  it('shows pending chip when there are pending days', () => {
    const store = createStore();
    store.set(authUserAtom, {
      id: 'emp-001',
      name: 'Test User',
      email: 'test@company.com',
      role: 'Engineer',
      department: 'Tech',
      avatarInitials: 'TU',
    });
    store.set(leaveTypesAtom, [
      { id: 'annual', name: 'Annual Leave', totalDays: 20, usedDays: 6, pendingDays: 3, color: '#085ED7' },
    ]);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LeavePage />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('3d pending')).toBeInTheDocument();
  });
});
