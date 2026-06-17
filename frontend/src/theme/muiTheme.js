import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
            secondary: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
            success: { main: '#10b981', light: '#34d399', dark: '#059669' },
            error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
            warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
            background: {
              default: '#0a0e1a',
              paper: '#1a1f35',
            },
            text: {
              primary: '#f1f5f9',
              secondary: '#94a3b8',
            },
            divider: 'rgba(148, 163, 184, 0.12)',
          }
        : {
            primary: { main: '#4f46e5', light: '#6366f1', dark: '#4338ca' },
            secondary: { main: '#0891b2', light: '#06b6d4', dark: '#0e7490' },
            success: { main: '#059669', light: '#10b981', dark: '#047857' },
            error: { main: '#dc2626', light: '#ef4444', dark: '#b91c1c' },
            warning: { main: '#d97706', light: '#f59e0b', dark: '#b45309' },
            background: {
              default: '#f1f5f9',
              paper: '#ffffff',
            },
            text: {
              primary: '#0f172a',
              secondary: '#475569',
            },
            divider: 'rgba(15, 23, 42, 0.08)',
          }),
    },
    typography: {
      fontFamily: '"Inter", "system-ui", "-apple-system", "sans-serif"',
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.08)' : '1px solid rgba(0,0,0,0.05)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(0,0,0,0.05)',
          },
        },
      },
    },
  });
