import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import useDarkMode from '../hooks/useDarkMode';

const NAVY = '#1F3C88';
const AQUA = '#2EC4B6';
const AQUA_DARK = '#1FA99E';

export default function Navbar() {
  const { logout, getUserField, isRole } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [dark, toggleDark] = useDarkMode();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  const roleBadgeStyle = isRole('admin')
    ? { background: '#EF4444', color: '#fff' }
    : isRole('placement')
    ? { background: AQUA, color: '#fff' }
    : isRole('club_leader')
    ? { background: '#F59E0B', color: '#fff' }
    : { background: AQUA, color: '#fff' };

  return (
    <>
      <nav style={{ background: NAVY }} className="text-white px-8 py-4 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold tracking-tight">CampusHub</span>
        </div>

        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{getUserField('name', 'Guest')}</p>
            <span style={roleBadgeStyle} className="text-xs font-bold px-2 py-0.5 rounded-full capitalize">
              {getUserField('role', 'student')}
            </span>
          </div>

          {/* Avatar */}
          <div
            style={{ background: AQUA, border: `2px solid #fff` }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold uppercase text-white"
          >
            {getUserField('name', 'G').charAt(0)}
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition hover:opacity-80"
            style={{ background: 'var(--aqua-light)', color: 'var(--navy)' }}
          >
            {dark ? '☀️' : '🌙'}
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowConfirm(true)}
            style={{ background: AQUA, color: '#fff' }}
            onMouseOver={(e) => e.currentTarget.style.background = AQUA_DARK}
            onMouseOut={(e) => e.currentTarget.style.background = AQUA}
            className="text-sm font-bold px-4 py-1.5 rounded-full transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">👋</div>
              <h3 className="text-lg font-bold" style={{ color: NAVY }}>Logging out?</h3>
              <p className="text-gray-500 text-sm mt-1">You'll need to sign in again to access your dashboard.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 text-white font-semibold py-2.5 rounded-xl transition"
                style={{ background: '#EF4444' }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
