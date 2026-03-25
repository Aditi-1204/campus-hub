import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const stats = [
  { icon: '📚', label: 'Courses Enrolled', value: '6' },
  { icon: '✅', label: 'Attendance', value: '82%' },
  { icon: '📝', label: 'Assignments Due', value: '3' },
  { icon: '🏆', label: 'CGPA', value: '8.4' },
];

const notices = [
  { title: 'Mid-Semester Exams', date: 'July 20, 2025', tag: 'Exam' },
  { title: 'Annual Sports Day Registration', date: 'July 15, 2025', tag: 'Event' },
  { title: 'Library Fine Waiver Week', date: 'July 10, 2025', tag: 'Notice' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    toast.success(`Welcome back, ${user.name}! 👋`, { id: 'welcome' });
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <nav className="bg-blue-900 text-white px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">🎓 CampusHub</span>
        <div className="flex items-center gap-4">
          <span className="text-blue-200 text-sm">
            {user?.name} · <span className="capitalize">{user?.role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-900 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-50 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-8">Here's your academic overview for today.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 text-center hover:shadow-md transition">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-blue-800">{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Notices */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">📢 Recent Notices</h2>
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.title} className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-center justify-between hover:shadow-md transition">
              <div>
                <p className="font-medium text-gray-800">{n.title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{n.date}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">{n.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
