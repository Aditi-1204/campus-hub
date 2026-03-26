import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-blue-900 text-white px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
      <button onClick={() => navigate('/dashboard')} className="text-xl font-bold hover:opacity-90 transition">
        🎓 CampusHub
      </button>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-200 hover:text-white transition">Dashboard</button>
        <button onClick={() => navigate('/events')} className="text-sm text-blue-200 hover:text-white transition">Campus Feed</button>
        <button onClick={() => navigate('/announcements')} className="text-sm text-blue-200 hover:text-white transition">Announcements</button>
        <span className="text-blue-300 text-sm border-l border-blue-700 pl-4">{user?.name} · <span className="capitalize">{user?.role}</span></span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-900 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
