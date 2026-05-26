import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import { authUserAtom } from '../atoms/authAtom';

const mockUser = {
  id: '1',
  name: 'Alex Morgan',
  email: 'alex.morgan@company.com',
  role: 'Software Engineer',
  department: 'Engineering',
  avatarInitials: 'AM',
};

function renderProfilePage() {
  const store = createStore();
  store.set(authUserAtom, mockUser);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </Provider>
  );
}

describe('ProfilePage — Home Address section', () => {
  it('renders the Home Address section', () => {
    renderProfilePage();
    expect(screen.getByTestId('home-address-section')).toBeInTheDocument();
  });

  it('displays the Home Address section heading', () => {
    renderProfilePage();
    expect(screen.getByText(/home address/i)).toBeInTheDocument();
  });

  it('displays the street address label and value', () => {
    renderProfilePage();
    expect(screen.getByText('Street Address')).toBeInTheDocument();
    expect(screen.getByText('742 Evergreen Terrace, Apt 4B')).toBeInTheDocument();
  });

  it('displays the city', () => {
    renderProfilePage();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('San Francisco')).toBeInTheDocument();
  });

  it('displays the state/province', () => {
    renderProfilePage();
    expect(screen.getByText('State / Province')).toBeInTheDocument();
    expect(screen.getByText('CA')).toBeInTheDocument();
  });

  it('displays the postal/zip code', () => {
    renderProfilePage();
    expect(screen.getByText('Postal / ZIP Code')).toBeInTheDocument();
    expect(screen.getByText('94107')).toBeInTheDocument();
  });

  it('displays the country', () => {
    renderProfilePage();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('renders nothing when user is not authenticated', () => {
    const store = createStore();
    store.set(authUserAtom, null);
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
