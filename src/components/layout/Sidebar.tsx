import { useAtom, useAtomValue } from 'jotai';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { sidebarOpenAtom } from '../../atoms/uiAtom';
import { authUserAtom } from '../../atoms/authAtom';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED = 64;

const navItems = [
  { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
  { label: 'My Profile', icon: <PersonOutlinedIcon />, path: '/profile' },
];

export default function Sidebar() {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  const user = useAtomValue(authUserAtom);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED,
          overflowX: 'hidden',
          transition: 'width 0.2s ease',
          background: '#081757',
          color: '#fff',
          border: 'none',
        },
      }}
    >
      {/* Logo area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 1,
          py: 2,
          minHeight: 64,
        }}
      >
        {open && (
          <Box component="img" src="/logo.svg" alt="thoughtminds" sx={{ height: 20, filter: 'brightness(0) invert(1)' }} />
        )}
        <Tooltip title={open ? 'Collapse' : 'Expand'} placement="right">
          <IconButton
            onClick={() => setOpen(!open)}
            size="small"
            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}
          >
            {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* App name */}
      {open && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            PeopleDesk
          </Typography>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Nav items */}
      <List sx={{ px: open ? 1 : 0.5, pt: 1.5 }} disablePadding>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Tooltip key={item.path} title={open ? '' : item.label} placement="right">
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  justifyContent: open ? 'flex-start' : 'center',
                  minHeight: 44,
                  px: open ? 1.5 : 1,
                  color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                  background: active ? 'rgba(8, 94, 215, 0.6)' : 'transparent',
                  '&:hover': { background: active ? 'rgba(8,94,215,0.7)' : 'rgba(255,255,255,0.08)', color: '#fff' },
                  '&.Mui-selected': { background: 'rgba(8, 94, 215, 0.6)' },
                  '&.Mui-selected:hover': { background: 'rgba(8, 94, 215, 0.75)' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: open ? 36 : 'auto' }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.label} slotProps={{ primary: { style: { fontSize: '0.875rem', fontWeight: active ? 600 : 400 } } }} />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* User chip at bottom */}
      {user && (
        <>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ p: open ? 2 : 1, display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: open ? 'flex-start' : 'center' }}>
            <Box
              sx={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#085ED7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}
            >
              {user.avatarInitials}
            </Box>
            {open && (
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.department}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.id}
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
}
