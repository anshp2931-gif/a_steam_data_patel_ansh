import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { getTheme } from './theme/muiTheme';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';

const AppContent = () => {
  const { theme } = useSelector((state) => state.ui);

  // Sync Tailwind class with state theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const muiTheme = getTheme(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-dark-900 dark:text-dark-100 bg-white text-gray-900 border dark:border-dark-800 border-gray-100',
          duration: 4000,
          style: {
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}

export default App;

