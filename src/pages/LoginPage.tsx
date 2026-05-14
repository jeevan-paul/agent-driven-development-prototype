import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { authUserAtom, isAuthenticatedAtom } from '../atoms/authAtom';

const DEMO_EMAIL = 'alex.morgan@company.com';
const DEMO_PASSWORD = 'password';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useSetAtom(isAuthenticatedAtom);
  const setUser = useSetAtom(authUserAtom);
  const navigate = useNavigate();

  const handleFillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser({
        id: 'emp-001',
        name: 'Alex Morgan',
        email: DEMO_EMAIL,
        role: 'Senior Software Engineer',
        department: 'Engineering',
        avatarInitials: 'AM',
      });
      setAuth(true);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Use the demo credentials below.');
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #081757 0%, #0d2270 50%, #085ED7 100%)',
      }}
    >
      {/* Left panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          px: 8,
          color: '#fff',
        }}
      >
        <Box component="img" src="/logo.svg" alt="thoughtminds" sx={{ height: 28, filter: 'brightness(0) invert(1)', mb: 6, width: 'fit-content' }} />
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
          Welcome to<br />PeopleDesk
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 380, lineHeight: 1.7 }}>
          Your all-in-one employee self-service portal. Manage your profile, request leaves, view payslips, and stay connected with your team.
        </Typography>

        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['Manage leave requests with ease', 'Access payslips anytime', 'Stay updated with company news'].map((text) => (
            <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right panel — login card */}
      <Box
        sx={{
          width: { xs: '100%', md: 480 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          background: { md: 'rgba(255,255,255,0.04)' },
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Mobile logo */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
              <Box component="img" src="/logo.svg" alt="thoughtminds" sx={{ height: 24 }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: '#085ED7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LockOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Sign in</Typography>
                <Typography variant="caption" color="text.secondary">PeopleDesk Employee Portal</Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, mt: 1 }}>
              Enter your work email and password to continue.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Work email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoComplete="email"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="current-password"
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.25,
                  background: '#085ED7',
                  '&:hover': { background: '#0649a8' },
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Box>

            {/* Demo hint */}
            <Box sx={{ mt: 3, p: 1.5, background: '#f0f7ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 500 }}>
                  Demo credentials
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleFillDemoCredentials}
                  sx={{
                    fontSize: '0.7rem',
                    py: 0.25,
                    px: 1,
                    minWidth: 0,
                    borderColor: '#bfdbfe',
                    color: '#1e40af',
                    '&:hover': { borderColor: '#085ED7', background: '#dbeafe' },
                    borderRadius: 1.5,
                    lineHeight: 1.5,
                  }}
                >
                  Use demo credentials
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: '#374151', display: 'block' }}>
                Email: <strong>{DEMO_EMAIL}</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: '#374151', display: 'block' }}>
                Password: <strong>{DEMO_PASSWORD}</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
