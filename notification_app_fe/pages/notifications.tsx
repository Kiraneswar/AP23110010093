import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Pagination, Alert, IconButton, useTheme } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { FilterBar } from '../components/FilterBar';
import { PrioritySection } from '../components/PrioritySection';
import { NotificationList } from '../components/NotificationList';
import { useNotifications } from '../hooks/useNotifications';
import { Log } from 'logging-middleware/logger';
import ReplayIcon from '@mui/icons-material/Replay';
import { useColorMode } from '../theme/ThemeContext';

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string | null>(null);
  
  const theme = useTheme();
  const colorMode = useColorMode();

  const {
    notifications,
    loading,
    error,
    isAuthError,
    readIds,
    markAsRead,
    markAllAsRead,
    refetch
  } = useNotifications({ limit: 10, page, notification_type: filter || undefined });

  useEffect(() => {
    Log("frontend", "info", "page", "User opened notifications page");
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight="bold" letterSpacing={-0.5}>
          Campus Notifications
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={markAllAsRead}
            disabled={loading || notifications.length === 0}
          >
            Mark all as read
          </Button>
        </Box>
      </Box>

      {!loading && !error && filter === null && (
        <PrioritySection 
          notifications={notifications} 
          readIds={readIds} 
          onRead={markAsRead} 
        />
      )}

      <Typography variant="subtitle2" fontWeight="bold" gutterBottom textTransform="uppercase" letterSpacing={1}>
        All Notifications
      </Typography>
      
      <FilterBar currentFilter={filter} onFilterChange={(f) => { setFilter(f); setPage(1); }} />

      {error ? (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={refetch} startIcon={<ReplayIcon />}>
              RETRY
            </Button>
          }
        >
          {isAuthError ? (
             <Box>
                <Typography variant="subtitle2">Authentication Failed</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Please ensure you have entered the correct registration credentials in your configuration file.</Typography>
                <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, fontFamily: 'monospace' }}>Details: {error}</Typography>
             </Box>
          ) : (
            <Box>
              <Typography variant="subtitle2">Network Error</Typography>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
        </Alert>
      ) : (
        <NotificationList 
          notifications={notifications} 
          loading={loading} 
          readIds={readIds} 
          onRead={markAsRead} 
        />
      )}

      {!loading && !error && notifications.length > 0 && (
        <Box display="flex" justifyContent="center" mt={6}>
          <Pagination 
            count={10}
            page={page} 
            onChange={(e, value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            color="primary" 
          />
        </Box>
      )}
      
    </Container>
  );
};

export default NotificationsPage;
