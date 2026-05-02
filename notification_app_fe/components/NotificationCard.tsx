import React from 'react';
import { Card, CardContent, Typography, Chip, Badge, Box, useTheme, Fade } from '@mui/material';
import { Notification } from '../utils/priority';
import { timeAgo } from '../utils/timeAgo';
import { Log } from 'logging-middleware/logger';

interface Props {
  notification: Notification;
  isRead: boolean;
  onRead: (id: string) => void;
}

const getColor = (type: string) => {
  switch (type) {
    case 'Placement': return 'success';
    case 'Result': return 'info';
    case 'Event': return 'warning';
    default: return 'default';
  }
};

export const NotificationCard: React.FC<Props> = ({ notification, isRead, onRead }) => {
  const theme = useTheme();

  const handleClick = () => {
    if (!isRead) {
      onRead(notification.id);
      Log("frontend", "info", "component", `User clicked notification ${notification.id}`);
    }
  };

  const typeColor = getColor(notification.type);

  return (
    <Fade in={true} timeout={500}>
      <Card
        onClick={handleClick}
        elevation={isRead ? 0 : 3}
        sx={{
          mb: 2,
          cursor: isRead ? 'default' : 'pointer',
          bgcolor: isRead
            ? 'background.paper'
            : (theme.palette.mode === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(25, 25, 25, 0.95)'),
          border: '1px solid',
          borderColor: isRead ? 'divider' : `${typeColor}.main`,
          borderLeft: isRead ? '1px solid divider' : `4px solid ${theme.palette[typeColor as 'success' | 'info' | 'warning'].main}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            bgcolor: isRead ? 'background.paper' : (theme.palette.mode === 'light' ? '#ffffff' : '#222222'),
          }
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              {!isRead && <Badge color="error" variant="dot" />}
              <Chip
                label={notification.type}
                color={getColor(notification.type) as any}
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {timeAgo(notification.timestamp)}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: isRead ? 'normal' : 600,
              color: isRead ? 'text.secondary' : 'text.primary'
            }}
          >
            {notification.message}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};
