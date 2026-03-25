import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function LoginFaculty() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to faculty dashboard
  useEffect(() => {
    const token = localStorage.getItem('campushub_token');
    if (token && user) navigate('/faculty-dashboard', { replace: true });
  }, []);

  const validFacultyEmail = (email) => /^[0-9]{6}[a-zA-Z]{4}@cgu-odisha\.ac\.in$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setApiError('');
    if (name === 'email')
      setEmailError(value && !validFacultyEmail(value) ? 'Incorrect email. Format: 6digits4letters@cgu-odisha.ac.in' : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validFacultyEmail(form.email)) {
      setEmailError('Incorrect email. Format: 6digits4letters@cgu-odisha.ac.in');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password, role: 'faculty' }
        : { email: form.email.trim(), password: form.password };

      const { data } = await api.post(endpoint, payload);

      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate('/faculty-dashboard');
    } catch (err) {
      const msg = err.message || 'Something went wrong';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-3xl">👨🏫</span>
          <h2 className="text-2xl font-bold text-emerald-900 mt-1">Faculty Portal</h2>
          <p className="text-gray-500 text-sm">{isRegister ? 'Create your faculty account' : 'Sign in to your faculty account'}</p>
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
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Full Name</label>
              <input
                name="name"
                placeholder="e.g. Dr. Ramesh Kumar"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Faculty Email</label>
            <input
              name="email"
              type="text"
              placeholder="e.g. 123456ABcd@cgu-odisha.ac.in"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${
                emailError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">⚠️ {emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white font-semibold py-2.5 rounded-lg hover:bg-emerald-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setApiError(''); setEmailError(''); }}
            className="text-emerald-600 font-semibold hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>

        <p className="text-center text-xs text-gray-400 mt-3">
          Not faculty?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline">
            Student Login
          </button>
        </p>
      </div>
    </div>
  );
}
