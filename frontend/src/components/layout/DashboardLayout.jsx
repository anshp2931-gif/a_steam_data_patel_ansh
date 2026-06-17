import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarCollapsed, sidebarOpen, theme } = useSelector((state) => state.ui);

  // Close sidebar drawer on route change on mobile/tablet view
  useEffect(() => {
    dispatch(setSidebarOpen(false));
  }, [location.pathname, dispatch]);

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${theme === 'dark' ? 'dark bg-surface-dark' : 'bg-gray-50'}`}>
      {/* Mobile Backdrop overlay */}
      {sidebarOpen && (
        <div
          onClick={() => dispatch(setSidebarOpen(false))}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300"
        />
      )}
      <Sidebar />
      <div
        className={`transition-all duration-300 min-w-0 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        } ml-0`}
      >
        <Navbar />
        <main className="p-4 sm:p-6 min-h-[calc(100vh-64px)]">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
