import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  TextField,
  InputAdornment,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import { fetchAllUsers, clearError } from '../../store/slices/userSlice';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getInitials, stringToColor } from '../../utils/helpers';

const UsersListPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { theme } = useSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Local filtering
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardStyle = theme === 'dark'
    ? 'bg-surface-dark-card border border-dark-700/30 rounded-xl shadow-glow-dark p-4 sm:p-6'
    : 'bg-white border border-gray-100 shadow-card-light rounded-xl p-4 sm:p-6';

  const tableHeaderStyle = theme === 'dark'
    ? 'text-left text-xs font-semibold text-dark-400 uppercase tracking-wider p-4 border-b border-dark-800 bg-dark-900/40'
    : 'text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4 border-b border-gray-100 bg-gray-50/50';

  const rowStyle = theme === 'dark'
    ? 'border-b border-dark-800/50 hover:bg-dark-900/30 transition text-dark-100'
    : 'border-b border-gray-100 hover:bg-gray-50/50 transition text-gray-800';

  return (
    <>
      <Helmet>
        <title>Users Management | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
            <PeopleIcon />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              User Accounts
            </h1>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
              Manage active user accounts, view register dates, and inspect roles.
            </p>
          </div>
        </div>

        {/* Filter Input */}
        <div className={cardStyle}>
          <TextField
            fullWidth
            placeholder="Search accounts by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </div>

        {/* Table representation */}
        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-dark-800 bg-white dark:bg-surface-dark-card shadow-lg">
          {loading ? (
            <div className="p-6">
              <SkeletonLoader type="table" count={1} />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className={tableHeaderStyle}>User</th>
                    <th className={tableHeaderStyle}>Email Address</th>
                    <th className={tableHeaderStyle}>Role Permissions</th>
                    <th className={`${tableHeaderStyle} hidden sm:table-cell`}>Created On</th>
                    <th className={`${tableHeaderStyle} hidden lg:table-cell`}>Account ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((item) => (
                    <tr key={item._id} className={rowStyle}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            sx={{
                              bgcolor: stringToColor(item.username),
                              width: 32,
                              height: 32,
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {getInitials(item.username)}
                          </Avatar>
                          <span className="font-semibold text-sm">{item.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-dark-350">
                        {item.email}
                      </td>
                      <td className="p-4">
                        <Chip
                          icon={item.role === 'admin' ? <AdminIcon sx={{ fontSize: '14px !important' }} /> : <UserIcon sx={{ fontSize: '14px !important' }} />}
                          label={item.role?.toUpperCase()}
                          size="small"
                          className={
                            item.role === 'admin'
                              ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-bold'
                              : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                          }
                        />
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-dark-400 font-mono hidden sm:table-cell">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="p-4 text-xs font-mono text-gray-400 dark:text-dark-500 hidden lg:table-cell">
                        {item._id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <EmptyState
                icon="👥"
                title="No Accounts Found"
                description="Try clearing search query or verifying the server connectivity."
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersListPage;
