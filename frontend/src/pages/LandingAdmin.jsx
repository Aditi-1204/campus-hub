import { useNavigate } from 'react-router-dom';

export default function LandingAdmin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-rose-700 to-red-800 text-white">
      <nav className="flex items-center justify-between px-8 py-5">
        <span className="text-2xl font-bold tracking-tight">🎓 CampusHub</span>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="text-rose-200 hover:text-white text-sm transition">Student?</button>
          <button onClick={() => navigate('/faculty')} className="text-rose-200 hover:text-white text-sm transition">Faculty?</button>
          <button onClick={() => navigate('/login')} className="bg-white text-rose-800 font-semibold px-5 py-2 rounded-full hover:bg-rose-50 transition">
            Admin Login
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="text-6xl mb-4">🛡️</div>
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Admin Portal <br /> Full Control. Full Visibility.
        </h1>
        <p className="text-rose-200 text-lg max-w-xl mb-8">
          Manage students, faculty, departments, notices, and the entire college system from a single powerful dashboard.
        </p>
        <button onClick={() => navigate('/login')} className="bg-white text-rose-800 font-bold px-8 py-3 rounded-full text-lg hover:bg-rose-50 transition shadow-lg">
          Enter Admin Panel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 pb-20 max-w-5xl mx-auto">
        {[
          { icon: '👥', title: 'Manage Students', desc: 'Add, update, or remove student records and profiles.' },
          { icon: '🏫', title: 'Departments', desc: 'Oversee all departments and their configurations.' },
          { icon: '📢', title: 'Notices', desc: 'Publish and manage college-wide announcements.' },
          { icon: '📊', title: 'Reports', desc: 'Generate attendance, result, and performance reports.' },
          { icon: '🔐', title: 'Access Control', desc: 'Manage roles and permissions for all users.' },
          { icon: '⚙️', title: 'System Settings', desc: 'Configure academic years, semesters, and more.' },
        ].map((f) => (
          <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/20 transition">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-xl font-bold mb-1">{f.title}</h3>
            <p className="text-rose-200 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
