import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import LandingUser from './pages/LandingUser';
import LandingAdmin from './pages/LandingAdmin';
import LandingFaculty from './pages/LandingFaculty';
import Login from './pages/Login';
import LoginFaculty from './pages/LoginFaculty';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingUser />} />
          <Route path="/admin" element={<LandingAdmin />} />
          <Route path="/faculty" element={<LandingFaculty />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-faculty" element={<LoginFaculty />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
