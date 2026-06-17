import { useEffect, useState } from 'react';
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
  Person as PersonIcon,
  SportsEsports as EsportsIcon,
} from '@mui/icons-material';
import { registerUser, clearError } from '../../store/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      const { username, email, password } = values;
      const resultAction = await dispatch(registerUser({ username, email, password }));
      if (registerUser.fulfilled.match(resultAction)) {
        if (resultAction.payload.success) {
          toast.success('Registration successful! Please login.');
          navigate('/login');
        } else {
          toast.error(resultAction.payload.message || 'Registration failed');
        }
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Register | Steam Games Dashboard</title>
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
              Join the Steam Analytics Platform
            </Typography>
            <Typography className="text-gray-400 text-base leading-relaxed">
              Create an account to browse thousands of Steam titles, check advanced platform demographics, filter pricing tiers, and manage the database.
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
                Create Account
              </Typography>
              <Typography className="text-gray-400 text-sm">
                Get started today by filling out your details below.
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon className="text-gray-400 text-sm" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

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

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="text-gray-400 text-sm" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? (
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </form>

            <Box className="mt-8 text-center">
              <Typography variant="body2" className="text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-400 hover:text-primary-300 font-semibold transition duration-200"
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
