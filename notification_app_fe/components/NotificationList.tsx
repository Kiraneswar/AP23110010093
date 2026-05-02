import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { NotificationCard } from './NotificationCard';
import { Notification } from '../utils/priority';

interface Props {
  notifications: Notification[];
  loading: boolean;
  readIds: Set<string>;
  onRead: (id: string) => void;
}

export const NotificationList: React.FC<Props> = ({ notifications, loading, readIds, onRead }) => {

  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Box>
    );
  }


  if (notifications.length === 0) {
    return (
      <Box textAlign="center" py={6} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No notifications found matching this criteria.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map(notif => (
        <NotificationCard 
          key={notif.id}
          notification={notif}
          isRead={readIds.has(notif.id)}
          onRead={onRead}
        />
      ))}
    </Box>
  );
};
