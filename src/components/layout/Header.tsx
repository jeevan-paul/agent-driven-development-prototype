import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
} from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { authUserAtom, isAuthenticatedAtom } from '../../atoms/authAtom';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const user = useAtomValue(authUserAtom);
  const setAuth = useSetAtom(isAuthenticatedAtom);
  const setUser = useSetAtom(authUserAtom);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAuth(false);
    setUser(null);
    navigate('/');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: '#fff',
        borderBottom: '1px solid #e9ecef',
        color: '#0f172a',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: '64px !important' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#0f172a', flexGrow: 1 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 36, height: 36,
                bgcolor: '#085ED7',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {user?.avatarInitials}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 200, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }} sx={{ gap: 1.5, py: 1 }}>
            <ListItemIcon><PersonOutlinedIcon fontSize="small" /></ListItemIcon>
            <Typography variant="body2">My Profile</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1, color: '#ef4444' }}>
            <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
            <Typography variant="body2">Sign out</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
