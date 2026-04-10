import { useAtomValue } from 'jotai';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { authUserAtom } from '../atoms/authAtom';

const quickLinks = [
  {
    label: 'Leave Request',
    description: 'Apply for leave or check balance',
    icon: <CalendarTodayOutlinedIcon />,
    color: '#085ED7',
    bg: '#eff6ff',
    tag: 'Coming soon',
  },
  {
    label: 'Payslips',
    description: 'View and download your payslips',
    icon: <AccountBalanceWalletOutlinedIcon />,
    color: '#059669',
    bg: '#ecfdf5',
    tag: 'Coming soon',
  },
  {
    label: 'Team Directory',
    description: 'Find and connect with colleagues',
    icon: <GroupOutlinedIcon />,
    color: '#7c3aed',
    bg: '#f5f3ff',
    tag: 'Coming soon',
  },
  {
    label: 'Documents',
    description: 'Access company documents',
    icon: <ArticleOutlinedIcon />,
    color: '#d97706',
    bg: '#fffbeb',
    tag: 'Coming soon',
  },
];

const announcements = [
  {
    id: 1,
    title: 'Office closure — Public Holiday',
    body: 'The office will be closed on 14th April for the public holiday. Enjoy your long weekend!',
    date: 'Apr 10, 2026',
    category: 'HR',
    categoryColor: '#085ED7',
  },
  {
    id: 2,
    title: 'Q2 All-Hands Meeting',
    body: 'Join us for the Q2 company-wide all-hands on 18th April at 10:00 AM. Zoom link will be shared separately.',
    date: 'Apr 8, 2026',
    category: 'Company',
    categoryColor: '#7c3aed',
  },
  {
    id: 3,
    title: 'Updated Work-from-Home Policy',
    body: 'HR has updated the remote work policy effective May 1st. Please review the document in the policy center.',
    date: 'Apr 5, 2026',
    category: 'Policy',
    categoryColor: '#059669',
  },
];

const stats = [
  { label: 'Leave Balance', value: '18 days', sub: 'Annual leave remaining', color: '#085ED7' },
  { label: 'Pending Requests', value: '2', sub: 'Awaiting approval', color: '#d97706' },
  { label: 'Team Members', value: '12', sub: 'In your department', color: '#7c3aed' },
  { label: 'Days to Appraisal', value: '47', sub: 'Next review cycle', color: '#059669' },
];

export default function DashboardPage() {
  const user = useAtomValue(authUserAtom);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Welcome banner */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #081757 0%, #085ED7 100%)',
          color: '#fff',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {greeting}, {user?.name?.split(' ')[0]}!
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                {user?.role} &bull; {user?.department}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', mt: 1, display: 'block' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(255,255,255,0.15)', fontSize: '1.2rem', fontWeight: 700, border: '2px solid rgba(255,255,255,0.3)' }}>
              {user?.avatarInitials}
            </Avatar>
          </Box>
        </CardContent>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -20, right: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: 10, right: 20, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
      </Card>

      {/* Stats row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
        {stats.map((stat) => (
          <Card key={stat.label} sx={{ borderRadius: 2.5 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: stat.color, mb: 1.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5, color: '#0f172a' }}>
                {stat.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.sub}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick links + Announcements */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        {/* Quick links */}
        <Card sx={{ borderRadius: 2.5 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5 }}>
              Quick Access
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {quickLinks.map((link) => (
                <Box
                  key={link.label}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: link.bg,
                    cursor: 'not-allowed',
                    opacity: 0.85,
                    border: `1px solid ${link.color}18`,
                    transition: 'all 0.15s',
                  }}
                >
                  <Box sx={{ color: link.color, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {link.icon}
                    <Chip label={link.tag} size="small" sx={{ fontSize: '0.65rem', height: 18, background: `${link.color}18`, color: link.color, fontWeight: 500 }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.25 }}>
                    {link.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                    {link.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card sx={{ borderRadius: 2.5 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5 }}>
              Announcements
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {announcements.map((item, idx) => (
                <Box key={item.id}>
                  <Box sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 18, background: `${item.categoryColor}15`, color: item.categoryColor, fontWeight: 600 }}
                      />
                      <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {item.body}
                    </Typography>
                  </Box>
                  {idx < announcements.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
