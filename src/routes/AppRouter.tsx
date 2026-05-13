import { useAtomValue } from 'jotai';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticatedAtom } from '../atoms/authAtom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import BuildPage from '../pages/BuildPage';
import AppLayout from '../components/layout/AppLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAtomValue(isAuthenticatedAtom);
  return isAuth ? <>{children}</> : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/build" element={<BuildPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
