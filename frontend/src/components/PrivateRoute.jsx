import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('campushub_token');

  // No token or user → redirect to login, preserve intended destination
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role not permitted → redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'faculty') return <Navigate to="/faculty-dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
