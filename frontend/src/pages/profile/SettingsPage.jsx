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
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  LockOutlined as LockIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { toggleTheme } from '../../store/slices/uiSlice';
import authService from '../../services/authService';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const [savingPassword, setSavingPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm new password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setSavingPassword(true);
        const res = await authService.changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });
        if (res.success) {
          toast.success('Password changed successfully.');
          resetForm();
        } else {
          toast.error(res.message || 'Failed to change password.');
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to update password.');
      } finally {
        setSavingPassword(false);
      }
    },
  });

  const cardStyle = theme === 'dark'
    ? 'bg-surface-dark-card border border-dark-700/30 rounded-xl p-4 sm:p-6 shadow-glow-dark mb-6'
    : 'bg-white border border-gray-100 shadow-card-light rounded-xl p-4 sm:p-6 mb-6';

  return (
    <>
      <Helmet>
        <title>Settings | Steam Games Dashboard</title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
            <SettingsIcon />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h1>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
              Configure application theme settings, accessibility options, and update password credentials.
            </p>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className={cardStyle}>
          <h3 className={`text-base font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <PaletteIcon className="text-primary-500" /> Theme Customization
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-400 mb-6">
            Toggle between light and dark visual interfaces. Selecting dark mode matches Steam's native neon dashboard experience.
          </p>
          <FormControlLabel
            control={
              <Switch
                checked={theme === 'dark'}
                onChange={() => dispatch(toggleTheme())}
                color="primary"
              />
            }
            label={theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
            className="text-gray-900 dark:text-white font-semibold text-sm"
          />
        </div>

        {/* Change Password Card */}
        <div className={cardStyle}>
          <h3 className={`text-base font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <LockIcon className="text-primary-500" /> Security Settings
          </h3>
          <p className="text-sm text-gray-500 dark:text-dark-400 mb-6">
            Update your account password. We recommend choosing a strong password with letters, numbers, and symbols.
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              type="password"
              id="oldPassword"
              name="oldPassword"
              label="Current Password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
              helperText={formik.touched.oldPassword && formik.errors.oldPassword}
              variant="outlined"
            />

            <Divider className="my-4 dark:border-dark-800" />

            <TextField
              fullWidth
              type="password"
              id="newPassword"
              name="newPassword"
              label="New Password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
              variant="outlined"
            />

            <TextField
              fullWidth
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              variant="outlined"
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={savingPassword}
                startIcon={savingPassword ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                className="py-2.5 px-6 font-semibold text-white rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 shadow-md transform hover:scale-[1.01] active:scale-[0.99] transition"
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
