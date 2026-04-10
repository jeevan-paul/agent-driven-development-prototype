import { useAtomValue } from 'jotai';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { authUserAtom } from '../atoms/authAtom';

const profileDetails = {
  phone: '+1 (555) 012-3456',
  location: 'San Francisco, CA',
  office: 'HQ — Floor 3',
  joinDate: 'March 15, 2021',
  employeeId: 'EMP-2021-001',
  manager: 'Sarah Chen',
  managerInitials: 'SC',
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5 }}>
    <Box sx={{ color: '#085ED7', mt: 0.1, flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, mb: 0.25 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  </Box>
);

export default function ProfilePage() {
  const user = useAtomValue(authUserAtom);

  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 900 }}>
      {/* Profile header card */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #081757 0%, #085ED7 100%)', height: 100 }} />
        <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mt: -4, mb: 2, flexWrap: 'wrap' }}>
            <Avatar
              sx={{
                width: 80, height: 80,
                bgcolor: '#fff',
                color: '#085ED7',
                fontSize: '1.6rem',
                fontWeight: 700,
                border: '3px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {user.avatarInitials}
            </Avatar>
            <Box sx={{ mt: '35px' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.role}</Typography>
            </Box>
            <Box sx={{ ml: 'auto', mb: 1 }}>
              <Chip label="Active" size="small" sx={{ background: '#ecfdf5', color: '#059669', fontWeight: 600, fontSize: '0.75rem' }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<BusinessOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />} label={user.department} size="small" variant="outlined" sx={{ borderColor: '#e2e8f0', color: '#475569', fontSize: '0.78rem' }} />
            <Chip icon={<BadgeOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />} label={profileDetails.employeeId} size="small" variant="outlined" sx={{ borderColor: '#e2e8f0', color: '#475569', fontSize: '0.78rem' }} />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Contact info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <InfoRow icon={<EmailOutlinedIcon fontSize="small" />} label="Work Email" value={user.email} />
              <Divider />
              <InfoRow icon={<PhoneOutlinedIcon fontSize="small" />} label="Phone" value={profileDetails.phone} />
              <Divider />
              <InfoRow icon={<LocationOnOutlinedIcon fontSize="small" />} label="Location" value={profileDetails.location} />
              <Divider />
              <InfoRow icon={<BusinessOutlinedIcon fontSize="small" />} label="Office" value={profileDetails.office} />
            </CardContent>
          </Card>
        </Grid>

        {/* Employment info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2.5, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                Employment Details
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <InfoRow icon={<BadgeOutlinedIcon fontSize="small" />} label="Employee ID" value={profileDetails.employeeId} />
              <Divider />
              <InfoRow icon={<BusinessOutlinedIcon fontSize="small" />} label="Department" value={user.department} />
              <Divider />
              <InfoRow icon={<CalendarMonthOutlinedIcon fontSize="small" />} label="Joining Date" value={profileDetails.joinDate} />
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5 }}>
                <Box sx={{ color: '#085ED7', mt: 0.1 }}>
                  <BadgeOutlinedIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, mb: 0.5 }}>Reports To</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#085ED7', fontSize: '0.65rem', fontWeight: 700 }}>
                      {profileDetails.managerInitials}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{profileDetails.manager}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
