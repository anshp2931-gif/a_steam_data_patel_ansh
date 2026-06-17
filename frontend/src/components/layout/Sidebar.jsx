import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dashboard as DashboardIcon,
  SportsEsports as GamesIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
} from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebarCollapse } from '../../store/slices/uiSlice';
import { ROLES } from '../../utils/constants';
import { getInitials, stringToColor } from '../../utils/helpers';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { sidebarCollapsed, sidebarOpen, theme } = useSelector((state) => state.ui);

  const isAdmin = user?.role === ROLES.ADMIN;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      id: 'games',
      label: 'Games',
      icon: <GamesIcon />,
      path: '/games',
    },
    ...(isAdmin
      ? [
          {
            id: 'users',
            label: 'Users',
            icon: <UsersIcon />,
            path: '/users',
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: <AnalyticsIcon />,
            path: '/dashboard/analytics',
          },
        ]
      : []),
    {
      id: 'profile',
      label: 'Profile',
      icon: <ProfileIcon />,
      path: '/profile',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:w-[72px] w-[260px]' : 'w-[260px]'
      } ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        theme === 'dark'
          ? 'bg-gradient-sidebar border-r border-dark-700/50'
          : 'bg-white border-r border-gray-200'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-dark-700/30">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <GamesIcon className="text-white" fontSize="small" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-lg gradient-text whitespace-nowrap">
              Steam Games
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 gap-2 flex flex-col">
        {menuItems.map((item) => (
          <Tooltip
            key={item.id}
            title={sidebarCollapsed ? item.label : ''}
            placement="right"
            arrow
          >
            <NavLink
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-primary-500/10 text-primary-400 shadow-glow-primary/20'
                      : 'bg-primary-50 text-primary-600'
                    : theme === 'dark'
                    ? 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } ${sidebarCollapsed ? 'justify-center' : ''}`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          </Tooltip>
        ))}
      </nav>

      {/* User section */}
      <div className={`p-3 border-t ${theme === 'dark' ? 'border-dark-700/30' : 'border-gray-200'}`}>
        {!sidebarCollapsed && (
          <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2 ${
              theme === 'dark' ? 'bg-dark-800/50' : 'bg-gray-50'
            }`}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.875rem',
                fontWeight: 600,
                bgcolor: stringToColor(user?.username),
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-dark-100' : 'text-gray-900'}`}>
                {user?.username}
              </p>
              <p className={`text-xs truncate ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
                {user?.role === ROLES.ADMIN ? '🛡️ Admin' : '👤 User'}
              </p>
            </div>
          </div>
        )}

        <Tooltip title={sidebarCollapsed ? 'Logout' : ''} placement="right" arrow>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200 ${
              theme === 'dark'
                ? 'text-dark-400 hover:text-red-400 hover:bg-red-500/10'
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            } ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogoutIcon fontSize="small" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </Tooltip>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => dispatch(toggleSidebarCollapse())}
        className={`absolute top-20 -right-3 w-6 h-6 rounded-full hidden lg:flex items-center justify-center shadow-lg z-50 transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-dark-700 border border-dark-600 text-dark-300 hover:text-primary-400 hover:border-primary-500/50'
            : 'bg-white border border-gray-300 text-gray-400 hover:text-primary-600 hover:border-primary-400'
        }`}
      >
        {sidebarCollapsed ? <ExpandIcon sx={{ fontSize: 14 }} /> : <CollapseIcon sx={{ fontSize: 14 }} />}
      </button>
    </aside>
  );
};

export default Sidebar;
