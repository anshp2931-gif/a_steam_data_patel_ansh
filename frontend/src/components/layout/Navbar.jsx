import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Badge, Avatar, Menu, MenuItem, Divider, IconButton, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { getInitials, stringToColor } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme, notifications } = useSelector((state) => state.ui);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header
      className={`sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-surface-dark/80 backdrop-blur-xl border-b border-dark-700/30'
          : 'bg-white/80 backdrop-blur-xl border-b border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Toggle Sidebar mobile */}
        <IconButton
          id="mobile-sidebar-toggle"
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden"
          sx={{
            color: theme === 'dark' ? '#94a3b8' : '#475569',
            p: 1,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-md">
          <div className="relative">
            <SearchIcon
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-dark-500' : 'text-gray-400'
              }`}
              fontSize="small"
            />
            <input
              id="navbar-search"
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-200 outline-none ${
                theme === 'dark'
                  ? 'bg-dark-800/60 border border-dark-700/50 text-dark-100 placeholder-dark-500 focus:border-primary-500/50 focus:bg-dark-800'
                  : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:bg-white'
              }`}
            />
          </div>
        </form>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <IconButton
          id="theme-toggle-btn"
          onClick={() => dispatch(toggleTheme())}
          size="small"
          sx={{
            color: theme === 'dark' ? '#94a3b8' : '#475569',
            '&:hover': {
              background: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.08)',
              color: theme === 'dark' ? '#818cf8' : '#4f46e5',
            },
          }}
        >
          {theme === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>

        {/* Notifications */}
        <IconButton
          id="notifications-btn"
          size="small"
          sx={{
            color: theme === 'dark' ? '#94a3b8' : '#475569',
            '&:hover': {
              background: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.08)',
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={9}>
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>

        {/* Profile Menu */}
        <button
          id="profile-menu-btn"
          onClick={handleProfileMenuOpen}
          className={`flex items-center gap-2 ml-2 pl-2 pr-3 py-1.5 rounded-lg transition-all duration-200 ${
            theme === 'dark'
              ? 'hover:bg-dark-800/50 border border-transparent hover:border-dark-700/50'
              : 'hover:bg-gray-100 border border-transparent hover:border-gray-200'
          }`}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.75rem',
              fontWeight: 700,
              bgcolor: stringToColor(user?.username),
            }}
          >
            {getInitials(user?.username)}
          </Avatar>
          <div className="hidden md:block text-left">
            <p className={`text-sm font-semibold leading-tight ${theme === 'dark' ? 'text-dark-100' : 'text-gray-900'}`}>
              {user?.username}
            </p>
            <p className={`text-xs leading-tight ${theme === 'dark' ? 'text-dark-500' : 'text-gray-500'}`}>
              {user?.role === ROLES.ADMIN ? 'Admin' : 'User'}
            </p>
          </div>
        </button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              bgcolor: theme === 'dark' ? '#1a1f35' : '#fff',
              border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid #e5e7eb',
              boxShadow: theme === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)',
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleProfileMenuClose();
              navigate('/profile');
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleProfileMenuClose();
              navigate('/settings');
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Navbar;
