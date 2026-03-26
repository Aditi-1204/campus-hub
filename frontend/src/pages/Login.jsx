import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to correct dashboard
  useEffect(() => {
    const token = localStorage.getItem('campushub_token');
    if (token && user) {
      if (user.role === 'admin') navigate('/admin-dashboard', { replace: true });
      else if (user.role === 'faculty') navigate('/faculty-dashboard', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, []);

  const validStudentEmail = (email) => /^[0-9]{10}@cgu-odisha\.ac\.in$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setApiError('');
    if (name === 'email')
      setEmailError(value && !validStudentEmail(value) ? 'Incorrect email ID' : '');
  };

  const redirectByRole = (role) => {
    if (role === 'admin') navigate('/admin-dashboard');
    else navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validStudentEmail(form.email)) {
      setEmailError('Incorrect email ID');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };

      const { data } = await api.post(endpoint, payload);

      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}!`);
      redirectByRole(data.user.role);
    } catch (err) {
      const raw = err.message || 'Something went wrong';
      // Map backend messages to user-friendly ones
      const msg =
        raw.includes('not found') || raw.includes('No user') ? 'User not found. Please register first.' :
        raw.includes('Incorrect password') || raw.includes('Invalid credentials') ? 'Incorrect password. Please try again.' :
        raw.includes('already registered') ? 'This email is already registered. Please login.' :
        raw;
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-amber-900 to-stone-700 flex items-center justify-center px-4">
      <div className="bg-amber-50 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-amber-200">
        <div className="text-center mb-6">
          <span className="text-3xl">🎓</span>
          <h2 className="text-2xl font-bold text-stone-800 mt-1">CampusHub</h2>
          <p className="text-stone-500 text-sm">{isRegister ? 'Create your account' : 'Sign in to your account'}</p>
        </div>

        {/* Inline API error banner */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
            ⚠️ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Full Name</label>
              <input
                name="name"
                placeholder="e.g. Aditi Sharma"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-amber-300 rounded-lg px-4 py-2.5 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">College Email</label>
            <input
              name="email"
              type="text"
              placeholder="e.g. 1234567890@cgu-odisha.ac.in"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-2.5 bg-amber-50 focus:outline-none focus:ring-2 ${
                emailError ? 'border-red-400 focus:ring-red-400' : 'border-amber-300 focus:ring-amber-700'
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠️ {emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-amber-300 rounded-lg px-4 py-2.5 pr-12 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-800 text-amber-50 font-semibold py-2.5 rounded-lg hover:bg-stone-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-amber-50" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {isRegister ? 'Registering...' : 'Signing in...'}
              </>
            ) : (
              isRegister ? 'Register' : 'Login'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setApiError(''); setEmailError(''); }}
            className="text-amber-800 font-semibold hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>

        <p className="text-center text-xs text-stone-400 mt-3">
          Faculty?{' '}
          <button onClick={() => navigate('/login-faculty')} className="text-amber-700 hover:underline">
            Faculty Login
          </button>
        </p>
      </div>
    </div>
  );
}
