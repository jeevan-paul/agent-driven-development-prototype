import { useAtomValue } from 'jotai';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { authUserAtom } from '../atoms/authAtom';
import { leaveTypesAtom } from '../atoms/leaveAtom';

export default function LeavePage() {
  const user = useAtomValue(authUserAtom);
  const leaveTypes = useAtomValue(leaveTypesAtom);

  const totalAvailable = leaveTypes.reduce((sum, lt) => sum + (lt.totalDays - lt.usedDays), 0);
  const totalUsed = leaveTypes.reduce((sum, lt) => sum + lt.usedDays, 0);
  const totalPending = leaveTypes.reduce((sum, lt) => sum + lt.pendingDays, 0);

  const summaryStats = [
    { label: 'Available Balance', value: totalAvailable, unit: 'days', icon: <EventAvailableOutlinedIcon />, color: '#085ED7', bg: '#eff6ff' },
    { label: 'Days Used', value: totalUsed, unit: 'days', icon: <CheckCircleOutlinedIcon />, color: '#059669', bg: '#ecfdf5' },
    { label: 'Pending Approval', value: totalPending, unit: 'days', icon: <HourglassEmptyOutlinedIcon />, color: '#d97706', bg: '#fffbeb' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Summary header */}
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
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Leave Balance
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            {user?.name} &bull; {user?.department}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', mt: 1, display: 'block' }}>
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} overview
          </Typography>
        </CardContent>
        <Box sx={{ position: 'absolute', top: -20, right: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: 10, right: 20, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
      </Card>

      {/* Summary stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
        {summaryStats.map((stat) => (
          <Card key={stat.label} sx={{ borderRadius: 2.5 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                {stat.value}
                <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.75 }}>
                  {stat.unit}
                </Typography>
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Leave type cards */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Leave Types
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          {leaveTypes.map((leave) => {
            const available = leave.totalDays - leave.usedDays;
            const progressValue = Math.min((leave.usedDays / leave.totalDays) * 100, 100);
            const isExhausted = available <= 0;

            return (
              <Card key={leave.id} sx={{ borderRadius: 2.5, border: isExhausted ? `1px solid ${leave.color}40` : 'none' }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: leave.color }} />
                    {isExhausted && (
                      <Chip
                        label="Exhausted"
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 18, background: `${leave.color}18`, color: leave.color, fontWeight: 600 }}
                      />
                    )}
                    {leave.pendingDays > 0 && !isExhausted && (
                      <Chip
                        label={`${leave.pendingDays}d pending`}
                        size="small"
                        sx={{ fontSize: '0.65rem', height: 18, background: '#fffbeb', color: '#d97706', fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                    {leave.name}
                  </Typography>

                  <Typography variant="h4" sx={{ fontWeight: 700, color: leave.color, lineHeight: 1, mb: 0.5 }}>
                    {available}
                    <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}>
                      / {leave.totalDays} days
                    </Typography>
                  </Typography>

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                    {leave.usedDays} used
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: `${leave.color}18`,
                      '& .MuiLinearProgress-bar': { background: leave.color, borderRadius: 3 },
                    }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
