import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
