import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  TextField, Button, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { key: 'student', label: 'Student', icon: <SchoolIcon />, color: '#2563eb', light: '#eff6ff' },
  { key: 'club', label: 'Club', icon: <GroupsIcon />, color: '#7c3aed', light: '#f5f3ff' },
  { key: 'placement', label: 'Placement', icon: <WorkIcon />, color: '#059669', light: '#ecfdf5' },
  { key: 'admin', label: 'Admin', icon: <AdminPanelSettingsIcon />, color: '#1e293b', light: '#f8fafc' },
];

export default function Login() {
  const location = useLocation();
  const initialRole = location.state?.role || 'student';
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const activeRole = ROLES.find((r) => r.key === role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password, role });
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'club') navigate('/club/dashboard');
      else if (role === 'student') navigate('/student/dashboard');
      else if (role === 'placement') navigate('/placement/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm">
            <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to home
          </button>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <SchoolIcon sx={{ color: 'white', fontSize: 28 }} />
            </div>
            <span className="text-2xl font-bold text-white">CampusHub</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Your campus,<br />all in one place.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Sign in to access your personalized dashboard — academics, clubs, placements and more.
          </p>
          <div className="mt-10 space-y-3">
            {ROLES.map((r) => (
              <div key={r.key} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${role === r.key ? 'bg-white/20' : 'opacity-50'}`}>
                <span className="text-white">{r.icon}</span>
                <span className="text-white font-medium">{r.label} Portal</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-indigo-300 text-sm relative z-10">© 2025 CampusHub. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile back */}
          <button onClick={() => navigate('/')} className="lg:hidden flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
            <ArrowBackIcon sx={{ fontSize: 16 }} /> Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-slate-900">Sign in</h1>
              <p className="text-slate-500 text-sm mt-1">Select your role and enter your credentials</p>
            </div>

            {/* Role selector */}
            <div className="grid grid-cols-4 gap-2 mb-8 p-1 bg-slate-100 rounded-2xl">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className={`flex flex-col items-center gap-1 py-3 px-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    role === r.key
                      ? 'bg-white shadow-sm text-slate-900 scale-105'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span style={{ color: role === r.key ? activeRole.color : undefined }}>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>

            {/* Active role badge */}
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
              style={{ background: activeRole.light, color: activeRole.color }}
            >
              {activeRole.icon}
              Signing in as <strong>{activeRole.label}</strong>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                placeholder={role === 'admin' ? 'admin@admin.com' : `Enter your ${role} email`}
                size="small"
                sx={{
                  mt: 2, mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&.Mui-focused fieldset': { borderColor: activeRole.color },
                  },
                  '& label.Mui-focused': { color: activeRole.color },
                }}
              />
              <TextField
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                size="small"
                sx={{
                  mt: 2, mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&.Mui-focused fieldset': { borderColor: activeRole.color },
                  },
                  '& label.Mui-focused': { color: activeRole.color },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPass(!showPass)} edge="end">
                        {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                sx={{
                  mt: 1,
                  bgcolor: activeRole.color,
                  '&:hover': { bgcolor: activeRole.color, filter: 'brightness(0.9)' },
                  borderRadius: '10px',
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: `0 4px 20px ${activeRole.color}40`,
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : `Sign in as ${activeRole.label}`}
              </Button>
            </form>

            {role === 'admin' && (
              <p className="text-center text-xs text-slate-400 mt-4">
                Default: admin@admin.com / admin@123
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
