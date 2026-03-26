import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import LandingUser from './pages/LandingUser';
import LandingAdmin from './pages/LandingAdmin';
import LandingFaculty from './pages/LandingFaculty';
import Login from './pages/Login';
import LoginFaculty from './pages/LoginFaculty';
import Dashboard from './pages/Dashboard';
import PlacementsList from './pages/placements/PlacementsList';
import PlacementDetail from './pages/placements/PlacementDetail';
import ApplyPlacement from './pages/placements/ApplyPlacement';
import CreatePlacement from './pages/placements/CreatePlacement';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingUser />} />
        <Route path="/admin" element={<LandingAdmin />} />
        <Route path="/faculty" element={<LandingFaculty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-faculty" element={<LoginFaculty />} />

        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['student']}>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/faculty-dashboard" element={
          <PrivateRoute allowedRoles={['faculty']}>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/admin-dashboard" element={
          <PrivateRoute allowedRoles={['admin']}>
            <Dashboard />
          </PrivateRoute>
        } />

        {/* Placement Routes */}
        <Route path="/placements" element={
          <PrivateRoute allowedRoles={['student', 'faculty', 'admin']}>
            <PlacementsList />
          </PrivateRoute>
        } />

        <Route path="/placements/:id" element={
          <PrivateRoute allowedRoles={['student', 'faculty', 'admin']}>
            <PlacementDetail />
          </PrivateRoute>
        } />

        <Route path="/placements/:id/apply" element={
          <PrivateRoute allowedRoles={['student']}>
            <ApplyPlacement />
          </PrivateRoute>
        } />

        <Route path="/admin/create-placement" element={
          <PrivateRoute allowedRoles={['faculty', 'admin']}>
            <CreatePlacement />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}