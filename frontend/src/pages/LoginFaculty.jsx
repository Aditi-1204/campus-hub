import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginFaculty() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // 6 digits + exactly 4 alphabets (case-sensitive allowed) + @cgu-odisha.ac.in
  const validFacultyEmail = (email) => /^[0-9]{6}[a-zA-Z]{4}@cgu-odisha\.ac\.in$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'email') {
      setEmailError(value && !validFacultyEmail(value) ? 'Incorrect email. Format: 6digits4letters@cgu-odisha.ac.in' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validFacultyEmail(form.email)) {
      setEmailError('Incorrect email. Format: 6digits4letters@cgu-odisha.ac.in');
      return;
    }
    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister ? { ...form, role: 'faculty' } : { email: form.email, password: form.password };
      const { data } = await axios.post(endpoint, payload);
      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate('/faculty-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-3xl">👨‍🏫</span>
          <h2 className="text-2xl font-bold text-emerald-900 mt-1">Faculty Portal</h2>
          <p className="text-gray-500 text-sm">{isRegister ? 'Create your faculty account' : 'Sign in to your faculty account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          )}
          <div>
            <input
              name="email"
              type="text"
              placeholder="Faculty Email (e.g. 123456ABcd@cgu-odisha.ac.in)"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${
                emailError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-emerald-500'
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                ⚠️ {emailError}
              </p>
            )}
          </div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white font-semibold py-2.5 rounded-lg hover:bg-emerald-800 transition disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setEmailError(''); }}
            className="text-emerald-600 font-semibold hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>

        <p className="text-center text-xs text-gray-400 mt-3">
          Not faculty? <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline">Student Login</button>
        </p>
      </div>
    </div>
  );
}
