import { useContext } from 'react';
import { Box, Paper, Typography, Alert, List, ListItem, ListItemText, IconButton, Chip, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { RemindersContext } from '../../context/RemindersContext';

function RemindersPanel() {
  const { reminders, markReminderAsRead, clearReminder } = useContext(RemindersContext);

  const unreadCount = reminders.filter(r => !r.read).length;
  const followUpReminders = reminders.filter(r => r.type === 'follow-up');
  const interviewReminders = reminders.filter(r => r.type === 'interview-reminder');

  if (reminders.length === 0) {
    return null;
  }

  const handleMarkAsRead = (reminderId) => {
    markReminderAsRead(reminderId);
  };

  const handleClearReminder = (reminderId) => {
    clearReminder(reminderId);
  };

  const ReminderItem = ({ reminder }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'follow-up':
          return <WarningIcon sx={{ color: '#f59e0b', mr: 2 }} />;
        case 'interview-reminder':
          return <CheckCircleIcon sx={{ color: '#10b981', mr: 2 }} />;
        default:
          return <NotificationsIcon sx={{ color: '#3b82f6', mr: 2 }} />;
      }
    };

    return (
      <Paper
        sx={{
          p: 2,
          mb: 1.5,
          borderLeft: `4px solid ${reminder.type === 'follow-up' ? '#f59e0b' : '#10b981'}`,
          bgcolor: reminder.read ? 'background.paper' : 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          {getIcon(reminder.type)}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {reminder.company} - {reminder.position}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {reminder.message}
            </Typography>
            <Chip
              label={reminder.type === 'follow-up' ? 'Follow-up' : 'Interview'}
              size="small"
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={() => handleClearReminder(reminder.id)}
          sx={{ ml: 1 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Paper>
    );
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: 'primary.main' }} />
        </Badge>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Active Reminders
        </Typography>
      </Box>

      {followUpReminders.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#f59e0b' }}>
            📝 Follow-up Reminders ({followUpReminders.length})
          </Typography>
          {followUpReminders.map((reminder) => (
            <ReminderItem key={reminder.id} reminder={reminder} />
          ))}
        </Box>
      )}

      {interviewReminders.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#10b981' }}>
            🎯 Interview Reminders ({interviewReminders.length})
          </Typography>
          {interviewReminders.map((reminder) => (
            <ReminderItem key={reminder.id} reminder={reminder} />
          ))}
        </Box>
      )}

      {reminders.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          You have {unreadCount > 0 ? `${unreadCount} unread` : 'no unread'} reminders. Keep track of your applications!
        </Alert>
      )}
    </Box>
  );
}

export default RemindersPanel;
