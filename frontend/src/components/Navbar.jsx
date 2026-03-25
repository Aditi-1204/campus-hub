import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, getUserField, isRole } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout(); // clears localStorage + resets user in context
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const roleColor = isRole('admin')
    ? 'text-red-300'
    : isRole('faculty')
    ? 'text-emerald-300'
    : 'text-blue-200';

  return (
    <>
      <nav className="bg-blue-900 text-white px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">🎓 CampusHub</span>

        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{getUserField('name', 'Guest')}</p>
            <p className={`text-xs capitalize ${roleColor}`}>{getUserField('role', 'student')}</p>
          </div>

          {/* Avatar initials */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold uppercase">
            {getUserField('name', 'G').charAt(0)}
          </div>

          {/* Logout button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-white text-blue-900 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-50 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">👋</div>
              <h3 className="text-lg font-bold text-gray-800">Logging out?</h3>
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
                className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 transition"
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
