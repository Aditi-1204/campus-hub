import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
<<<<<<< HEAD
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
=======
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
>>>>>>> 6d702ef7b83c9d682a864bb27484a3e2cfb9bd21

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
<<<<<<< HEAD
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />
        </Routes>
      </BrowserRouter>
=======
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
>>>>>>> 6d702ef7b83c9d682a864bb27484a3e2cfb9bd21
    </AuthProvider>
  );
}