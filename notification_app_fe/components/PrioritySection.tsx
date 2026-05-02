import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Grow } from '@mui/material';
import { Notification, getTopNotifications } from '../utils/priority';
import { NotificationList } from './NotificationList';

interface Props {
  notifications: Notification[];
  readIds: Set<string>;
  onRead: (id: string) => void;
}

export const PrioritySection: React.FC<Props> = ({ notifications, readIds, onRead }) => {
  const [topNotifs, setTopNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    let isMounted = true;
    const compute = async () => {
      try {
        const top = await getTopNotifications(notifications, 3);
        if (isMounted) setTopNotifs(top);
      } catch (err) {
        console.error("Priority computation failed:", err);
      }
    };
    if (notifications.length > 0) compute();

    return () => { isMounted = false; };
  }, [notifications]);

  if (topNotifs.length === 0) return null;

  return (
    <Grow in={true} timeout={800}>
      <Box mb={5}>
        <Typography variant="subtitle2" fontWeight="800" color="primary" gutterBottom textTransform="uppercase" letterSpacing={1.5}>
          Top Priority
        </Typography>
        <NotificationList
          notifications={topNotifs}
          loading={false}
          readIds={readIds}
          onRead={onRead}
        />
        <Divider sx={{ mt: 4, opacity: 0.6 }} />
      </Box>
    </Grow>
  );
};
