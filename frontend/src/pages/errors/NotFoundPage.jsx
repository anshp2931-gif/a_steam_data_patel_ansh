import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button, Typography } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Steam Games Dashboard</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 select-none">
        <div className="text-center relative max-w-lg w-full p-8 rounded-2xl bg-white/5 dark:bg-dark-900/50 backdrop-blur-md border border-gray-200/10 dark:border-dark-800 shadow-2xl transition-all duration-300 hover:shadow-primary-500/10 hover:border-primary-500/20">
          {/* Neon Glow Circle Background */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl -z-10 animate-pulse" />

          <Typography
            variant="h1"
            className="text-8xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-indigo-500 to-cyan-400 tracking-tighter animate-bounce"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900 }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            className="mt-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
            style={{ fontWeight: 700 }}
          >
            Lost in Cyberspace?
          </Typography>

          <Typography className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm mx-auto text-sm md:text-base leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>

          <div className="mt-8 flex justify-center">
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              className="px-6 py-3 font-semibold rounded-xl text-white shadow-lg bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
