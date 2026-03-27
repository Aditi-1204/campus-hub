import { useNavigate } from 'react-router-dom';

const NAVY  = '#1F3C88';
const AQUA  = '#2EC4B6';
const AQUA_DARK = '#1FA99E';
const BG    = '#F4F9F9';

const features = [
  { icon: '📚', title: 'Academics',       desc: 'Manage courses, timetables, assignments and academic records across departments.' },
  { icon: '🏅', title: 'Events & Clubs',  desc: 'Organise and track club activities, events, announcements and registrations.' },
  { icon: '💼', title: 'Placements',      desc: 'Post drives, track applicants and manage company visits and placement stats.' },
  { icon: '📢', title: 'Announcements',   desc: 'Broadcast college-wide notices, updates and important communications instantly.' },
  { icon: '💬', title: 'Communication',   desc: 'Connect students, faculty and staff through a unified messaging platform.' },
  { icon: '👥', title: 'User Management', desc: 'Manage roles, access and profiles for students, faculty and administrators.' },
];

const roles = [
  { icon: '🎒', label: 'Students',       desc: 'Access academics, results and campus updates' },
  { icon: '🏅', label: 'Club Leaders',   desc: 'Manage events, members and announcements' },
  { icon: '💼', label: 'Placement Team', desc: 'Post drives and track applicants' },
  { icon: '🛡️', label: 'Admins',         desc: 'Oversee all portals and manage users' },
];

export default function LandingUser() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* Navbar */}
      <nav style={{ background: NAVY }} className="flex items-center justify-between px-8 py-4 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold text-white tracking-tight">CampusHub</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{ background: AQUA, color: '#fff' }}
          onMouseOver={(e) => e.currentTarget.style.background = AQUA_DARK}
          onMouseOut={(e) => e.currentTarget.style.background = AQUA}
          className="font-bold px-5 py-2 rounded-full transition text-sm"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <div
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a5276 50%, ${AQUA} 100%)` }}
        className="text-white px-6 py-24 text-center"
      >
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Your Campus, Connected.
        </h1>
        <p style={{ color: '#B2EBE8' }} className="text-lg max-w-2xl mx-auto mb-8">
          Manage academics, events, placements, and communication — all in one platform.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{ background: AQUA, color: '#fff' }}
          onMouseOver={(e) => e.currentTarget.style.background = AQUA_DARK}
          onMouseOut={(e) => e.currentTarget.style.background = AQUA}
          className="font-bold px-8 py-3 rounded-full text-lg transition shadow-lg"
        >
          Enter Campus →
        </button>
      </div>

      {/* Who is it for */}
      <div className="max-w-5xl mx-auto px-8 py-14">
        <h2 className="text-center text-2xl font-bold mb-2" style={{ color: NAVY }}>
          Built for everyone on campus
        </h2>
        <p className="text-center text-gray-400 text-sm mb-10">
          One platform, multiple roles — each with their own dedicated experience.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {roles.map((r) => (
            <div key={r.label} className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-2">{r.icon}</div>
              <h3 className="font-bold text-sm mb-1" style={{ color: NAVY }}>{r.label}</h3>
              <p className="text-gray-400 text-xs">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background: '#E8F6F5' }} className="px-8 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-2" style={{ color: NAVY }}>
            Everything you need, in one place
          </h2>
          <p className="text-center text-gray-400 text-sm mb-10">
            Powerful tools designed for modern campus management.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition border border-gray-100">
                <div style={{ background: '#E8F6F5' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-1" style={{ color: NAVY }}>{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${AQUA} 100%)` }} className="text-white text-center px-6 py-14">
        <h2 className="text-3xl font-extrabold mb-3">Ready to get started?</h2>
        <p style={{ color: '#B2EBE8' }} className="text-base mb-6 max-w-lg mx-auto">
          Join your campus community and access everything from one unified dashboard.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{ background: '#fff', color: NAVY }}
          onMouseOver={(e) => e.currentTarget.style.background = '#E8F6F5'}
          onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
          className="font-bold px-8 py-3 rounded-full text-lg transition shadow-lg"
        >
          Enter Campus →
        </button>
      </div>

      {/* Footer */}
      <div style={{ background: NAVY }} className="text-center py-6">
        <p style={{ color: '#B2EBE8' }} className="text-sm">© 2025 CampusHub · All rights reserved</p>
      </div>
    </div>
  );
}
