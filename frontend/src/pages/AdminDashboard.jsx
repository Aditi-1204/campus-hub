import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { T } from '../utils/theme';

const portals = [
  {
    title: 'Student Portal',
    subtitle: 'Manage Students & Academics',
    icon: '🎒',
    desc: 'View registered students, manage timetables, track attendance and academic records.',
    path: '/admin/student-portal',
    features: ['Student Records', 'Timetable Management', 'Attendance Tracking'],
  },
  {
    title: 'Club Portal',
    subtitle: 'Manage Clubs & Events',
    icon: '🏅',
    desc: 'View club leaders, manage club events, announcements and member communications.',
    path: '/admin/club-portal',
    features: ['Club Leaders', 'Event Management', 'Announcements'],
  },
  {
    title: 'Placement Portal',
    subtitle: 'Manage Drives & Applicants',
    icon: '💼',
    desc: 'Oversee placement drives, track applicants, view stats and manage company records.',
    path: '/admin/placement-portal',
    features: ['Placement Drives', 'Applicant Tracking', 'Placement Stats'],
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { getUserField } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: T.bg }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, #1a5276 50%, ${T.aqua} 100%)` }}
        className="text-white px-6 py-14 text-center">
        <div className="text-5xl mb-3">🛡️</div>
        <h1 className="text-3xl font-extrabold mb-2">Admin Dashboard</h1>
        <p style={{ color: '#B2EBE8' }} className="text-base">
          Welcome back, <span className="font-bold text-white">{getUserField('name', 'Admin')}</span>. Choose a portal to manage.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((p) => (
            <button
              key={p.title}
              onClick={() => navigate(p.path)}
              className="text-left rounded-2xl bg-white border group transition-all duration-200 hover:shadow-2xl hover:-translate-y-2"
              style={{ minHeight: 300, borderColor: T.border }}
            >
              {/* Top band */}
              <div className="rounded-t-2xl px-6 pt-8 pb-6" style={{ background: T.aquaLight }}>
                <div className="text-5xl mb-3">{p.icon}</div>
                <h2 className="text-xl font-extrabold" style={{ color: T.navy }}>{p.title}</h2>
                <p className="text-xs font-semibold mt-1" style={{ color: T.aquaDark }}>{p.subtitle}</p>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.features.map((f) => (
                    <span key={f} className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: T.aquaLight, color: T.navy }}>{f}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: T.aqua }}>
                  Open Portal
                  <span className="group-hover:translate-x-1.5 transition-transform inline-block">→</span>
                </div>
              </div>

              <div className="h-1 rounded-b-2xl" style={{ background: T.aqua }} />
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Portals', value: '3',       icon: '🗂️' },
            { label: 'System Status', value: 'Online',  icon: '🟢' },
            { label: 'Academic Year', value: '2024–25', icon: '📅' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 text-center hover:shadow-md transition"
              style={{ border: `1px solid ${T.border}` }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-lg font-bold" style={{ color: T.navy }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: T.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: T.textMuted }}>© 2025 CampusHub Admin Panel</p>
      </div>
    </div>
  );
}
