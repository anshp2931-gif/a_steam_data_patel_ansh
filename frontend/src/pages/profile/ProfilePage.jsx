import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  TextField,
  Button,
  CircularProgress,
  Grid,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Save as SaveIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { updateProfile } from '../../store/slices/authSlice';
import { formatDate, getInitials, stringToColor } from '../../utils/helpers';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const [saving, setSaving] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
    validationSchema: Yup.object({
      username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        setSaving(true);
        const resultAction = await dispatch(updateProfile(values));
        if (updateProfile.fulfilled.match(resultAction)) {
          if (resultAction.payload.success) {
            toast.success('Profile updated successfully.');
          } else {
            toast.error(resultAction.payload.message || 'Failed to update profile.');
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred while saving profile.');
      } finally {
        setSaving(false);
      }
    },
  });

  const cardStyle = theme === 'dark'
    ? 'bg-surface-dark-card border border-dark-700/30 rounded-xl p-4 sm:p-6 shadow-glow-dark'
    : 'bg-white border border-gray-100 shadow-card-light rounded-xl p-4 sm:p-6';

  return (
    <>
      <Helmet>
        <title>My Profile | Steam Games Dashboard</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            My Profile
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
            Manage your account credentials, update details, and view access roles.
          </p>
        </div>

        {/* Profile Card split */}
        <Grid container spacing={4}>
          {/* Avatar side */}
          <Grid item xs={12} md={4}>
            <div className={`${cardStyle} flex flex-col items-center text-center gap-4`}>
              <Avatar
                sx={{
                  bgcolor: stringToColor(user?.username),
                  width: 96,
                  height: 96,
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }}
              >
                {getInitials(user?.username)}
              </Avatar>
              <div>
                <Typography variant="h5" className="font-extrabold text-gray-900 dark:text-white">
                  {user?.username}
                </Typography>
                <Typography className="text-gray-500 dark:text-dark-400 text-sm mt-0.5">
                  {user?.email}
                </Typography>
              </div>

              <div className="w-full border-t border-gray-100 dark:border-dark-800 pt-4 mt-2 space-y-2.5 text-left text-xs text-gray-500 dark:text-dark-400">
                <div className="flex items-center justify-between">
                  <span>Role:</span>
                  <span className="font-bold flex items-center gap-1 text-primary-500">
                    <AdminIcon sx={{ fontSize: 14 }} /> {user?.role?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Registered:</span>
                  <span className="font-semibold text-gray-800 dark:text-dark-200">
                    {formatDate(user?.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>User ID:</span>
                  <span className="font-mono text-[10px] text-gray-400 dark:text-dark-500">
                    {user?._id}
                  </span>
                </div>
              </div>
            </div>
          </Grid>

          {/* Form side */}
          <Grid item xs={12} md={8}>
            <div className={cardStyle}>
              <h3 className={`text-base font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <SecurityIcon className="text-primary-500" /> Account Settings
              </h3>

              <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <PersonIcon className="text-gray-400 text-sm" />
                      </Box>
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
                      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        <EmailIcon className="text-gray-400 text-sm" />
                      </Box>
                    ),
                  }}
                  variant="outlined"
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                    className="py-2.5 px-6 font-semibold text-white rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 shadow-md transform hover:scale-[1.01] active:scale-[0.99] transition"
                  >
                    Save Details
                  </Button>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ProfilePage;
