import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardByRole } from '../utils/roleUtils';

export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('campushub_token');

  if (!token || !user)
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to={getDashboardByRole(user.role)} replace />;

  return children;
}
