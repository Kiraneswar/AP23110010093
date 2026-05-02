import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) setMode('light');
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#3b82f6' : '#60a5fa',
          },
          success: {
            main: mode === 'light' ? '#10b981' : '#34d399',
            light: mode === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.15)',
          },
          info: {
            main: mode === 'light' ? '#3b82f6' : '#60a5fa',
            light: mode === 'light' ? '#dbeafe' : 'rgba(59, 130, 246, 0.15)',
          },
          warning: {
            main: mode === 'light' ? '#f59e0b' : '#fbbf24',
            light: mode === 'light' ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
          },
          background: {
            default: mode === 'light' ? '#f1f5f9' : '#000000',
            paper: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 18, 0.8)',
          },
        },
        typography: {
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 800,
            letterSpacing: '-0.04em',
          },
          subtitle2: {
            fontWeight: 700,
            letterSpacing: '0.05em',
          }
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundImage: 'none',
                backdropFilter: 'blur(12px)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'light'
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 12,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
