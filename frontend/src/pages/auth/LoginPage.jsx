import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  SportsEsports as EsportsIcon,
} from '@mui/icons-material';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { useState } from 'react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const formik = useFormik({
    initialState: {
      email: '',
      password: '',
    },
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      dispatch(loginUser(values));
    },
  });

  return (
    <>
      <Helmet>
        <title>Login | Steam Games Dashboard</title>
      </Helmet>

      <div className="min-h-screen flex flex-col md:flex-row bg-dark-950 text-gray-100 font-sans">
        {/* Left Side: Gradient Banner with Info */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-950 via-dark-950 to-cyan-950 flex-col justify-between p-12 relative overflow-hidden border-r border-gray-800/20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

          {/* Logo Section */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <EsportsIcon className="text-white text-xl" />
            </div>
            <Typography variant="h6" className="font-extrabold tracking-tight text-white">
              STEAM DASHBOARD
            </Typography>
          </div>

          {/* Splash Content */}
          <div className="max-w-md my-auto">
            <Typography variant="h3" className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 tracking-tight leading-tight mb-4" style={{ fontWeight: 800 }}>
              Unlock In-Depth Steam Game Analytics
            </Typography>
            <Typography className="text-gray-400 text-base leading-relaxed">
              Track active counts, manage inventory datasets, generate real-time visual charts, and view developer rankings with our responsive admin tool.
            </Typography>
          </div>

          {/* Footer Info */}
          <div className="text-sm text-gray-500">
            &copy; 2026 Steam Games Dashboard. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-dark-950">
          <div className="max-w-md w-full">
            {/* Header info for mobile/tablet */}
            <div className="md:hidden flex items-center gap-2 mb-8 select-none">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-indigo-600 flex items-center justify-center">
                <EsportsIcon className="text-white text-sm" />
              </div>
              <Typography variant="h6" className="font-black text-white text-lg">
                STEAM DASHBOARD
              </Typography>
            </div>

            <Box className="mb-8">
              <Typography variant="h4" className="font-bold text-white mb-2" style={{ fontWeight: 750 }}>
                Welcome Back
              </Typography>
              <Typography className="text-gray-400 text-sm">
                Sign in to continue managing and analyzing Steam datasets.
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon className="text-gray-400 text-sm" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="text-gray-400 text-sm" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? (
                          <VisibilityOffIcon className="text-gray-400 text-sm" />
                        ) : (
                          <VisibilityIcon className="text-gray-400 text-sm" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <Button
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
                className="py-3 font-semibold rounded-xl text-white shadow-lg bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 transition-all duration-300 transform active:scale-[0.98]"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>

            <Box className="mt-8 text-center">
              <Typography variant="body2" className="text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-400 hover:text-primary-300 font-semibold transition duration-200"
                >
                  Create one now
                </Link>
              </Typography>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
