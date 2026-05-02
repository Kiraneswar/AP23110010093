import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Log } from 'logging-middleware/logger';

interface Props {
  currentFilter: string | null;
  onFilterChange: (type: string | null) => void;
}

const TYPES = ['Event', 'Result', 'Placement'];

export const FilterBar: React.FC<Props> = ({ currentFilter, onFilterChange }) => {

  const handleFilter = (type: string | null) => {
    onFilterChange(type);
    Log("frontend", "info", "component", `User changed filter to ${type || 'All'}`);
  };

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      gap={1.5} 
      mb={4} 
      flexWrap="wrap"
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" mr={1} textTransform="uppercase" letterSpacing={1}>
        Filter:
      </Typography>

      <Chip
        label="All"
        onClick={() => handleFilter(null)}
        color={currentFilter === null ? 'primary' : 'default'}
        variant={currentFilter === null ? 'filled' : 'outlined'}
        sx={{ transition: 'all 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
      />
      {TYPES.map(type => (
        <Chip
          key={type}
          label={type}
          onClick={() => handleFilter(type)}
          color={currentFilter === type ? 'primary' : 'default'}
          variant={currentFilter === type ? 'filled' : 'outlined'}
          sx={{ transition: 'all 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
        />
      ))}
    </Box>
  );
};
