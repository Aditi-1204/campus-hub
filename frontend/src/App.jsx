import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import LandingUser from './pages/LandingUser';
import LandingAdmin from './pages/LandingAdmin';
import LandingFaculty from './pages/LandingFaculty';
import Login from './pages/Login';
import LoginFaculty from './pages/LoginFaculty';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingUser />} />
          <Route path="/admin" element={<LandingAdmin />} />
          <Route path="/faculty" element={<LandingFaculty />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-faculty" element={<LoginFaculty />} />

          {/* Protected: students only */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['student']}>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* Protected: faculty only — add FacultyDashboard page when ready */}
          <Route path="/faculty-dashboard" element={
            <PrivateRoute allowedRoles={['faculty']}>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* Protected: admin only — add AdminDashboard page when ready */}
          <Route path="/admin-dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
