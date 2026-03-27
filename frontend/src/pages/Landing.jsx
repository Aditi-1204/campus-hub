import { useNavigate } from 'react-router-dom';
import { Button, Chip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InsightsIcon from '@mui/icons-material/Insights';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FEATURES = [
  {
    icon: <SchoolIcon sx={{ fontSize: 32 }} />,
    title: 'Student Portal',
    desc: 'Access academic records, attendance, timetables and announcements all in one place.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 32 }} />,
    title: 'Club Management',
    desc: 'Discover, join and manage college clubs. Post events and connect with members.',
    color: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    icon: <WorkIcon sx={{ fontSize: 32 }} />,
    title: 'Placement Cell',
    desc: 'Browse job listings, apply for internships and track your placement journey.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />,
    title: 'Admin Control',
    desc: 'Manage users, monitor activity and configure the entire campus platform.',
    color: 'from-orange-500 to-red-600',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
];

const STATS = [
  { value: '5,000+', label: 'Students Enrolled' },
  { value: '120+', label: 'Active Clubs' },
  { value: '300+', label: 'Placements This Year' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const HIGHLIGHTS = [
  'Real-time notifications & announcements',
  'Secure role-based access control',
  'Placement tracking & analytics',
  'Club event management',
  'Academic performance insights',
  'Mobile-friendly responsive design',
];

const LOGIN_CARDS = [
  { role: 'student', label: 'Student', icon: <SchoolIcon />, color: 'bg-blue-600 hover:bg-blue-700', desc: 'Access your academic portal' },
  { role: 'club', label: 'Club', icon: <GroupsIcon />, color: 'bg-purple-600 hover:bg-purple-700', desc: 'Manage your club activities' },
  { role: 'placement', label: 'Placement', icon: <WorkIcon />, color: 'bg-emerald-600 hover:bg-emerald-700', desc: 'Placement cell dashboard' },
  { role: 'admin', label: 'Admin', icon: <AdminPanelSettingsIcon />, color: 'bg-slate-800 hover:bg-slate-900', desc: 'Full platform control' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <SchoolIcon sx={{ fontSize: 18, color: 'white' }} />
            </div>
            <span className="text-lg font-bold text-slate-900">CampusHub</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl -z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Chip
            label="🎓 All-in-one Campus Platform"
            size="small"
            sx={{ mb: 3, bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 600, fontSize: '0.75rem' }}
          />
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Your Campus,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            CampusHub brings students, clubs, placement cell and administration together on a single unified platform — streamlining every aspect of college life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#4f46e5',
                '&:hover': { bgcolor: '#4338ca' },
                borderRadius: '10px',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 24px rgba(79,70,229,0.35)',
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              sx={{
                borderColor: '#e2e8f0',
                color: '#475569',
                borderRadius: '10px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { borderColor: '#4f46e5', color: '#4f46e5', bgcolor: '#eef2ff' },
              }}
            >
              Explore Features
            </Button>
          </div>
        </div>

        {/* Hero visual */}
        <div className="max-w-5xl mx-auto mt-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-xs text-slate-400">campushub.edu.in/dashboard</div>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: '5,248', color: 'bg-blue-50 text-blue-700', icon: <SchoolIcon sx={{ fontSize: 20 }} /> },
                { label: 'Active Clubs', value: '124', color: 'bg-purple-50 text-purple-700', icon: <GroupsIcon sx={{ fontSize: 20 }} /> },
                { label: 'Job Listings', value: '89', color: 'bg-emerald-50 text-emerald-700', icon: <WorkIcon sx={{ fontSize: 20 }} /> },
                { label: 'Notifications', value: '12 New', color: 'bg-orange-50 text-orange-700', icon: <NotificationsActiveIcon sx={{ fontSize: 20 }} /> },
              ].map((card) => (
                <div key={card.label} className={`${card.color} rounded-xl p-4`}>
                  <div className="mb-2 opacity-70">{card.icon}</div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="text-xs font-medium opacity-70 mt-1">{card.label}</div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Upcoming: Tech Fest 2025', tag: 'Event', tagColor: 'bg-indigo-100 text-indigo-700' },
                { title: 'TCS Campus Drive — Apply Now', tag: 'Placement', tagColor: 'bg-emerald-100 text-emerald-700' },
                { title: 'Semester Results Published', tag: 'Academic', tagColor: 'bg-blue-100 text-blue-700' },
              ].map((item) => (
                <div key={item.title} className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                  <div className="flex-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                    <p className="text-sm font-medium text-slate-700 mt-2">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-extrabold mb-1">{s.value}</div>
              <div className="text-indigo-200 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Chip label="Features" size="small" sx={{ mb: 2, bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 600 }} />
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Everything your campus needs</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Four powerful portals, one seamless experience for every stakeholder in your institution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group border border-slate-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.text} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Chip label="Why CampusHub" size="small" sx={{ mb: 2, bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 600 }} />
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Built for modern campus life</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We've designed CampusHub from the ground up to handle the complexity of a modern educational institution — with security, speed and simplicity at its core.
            </p>
            <div className="space-y-3">
              {HIGHLIGHTS.map((h) => (
                <div key={h} className="flex items-center gap-3">
                  <CheckCircleIcon sx={{ color: '#4f46e5', fontSize: 20 }} />
                  <span className="text-slate-700 font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <InsightsIcon sx={{ fontSize: 28 }} />, title: 'Analytics', desc: 'Track performance metrics across all departments', color: 'bg-indigo-600' },
              { icon: <SecurityIcon sx={{ fontSize: 28 }} />, title: 'Secure', desc: 'Role-based access with JWT authentication', color: 'bg-purple-600' },
              { icon: <NotificationsActiveIcon sx={{ fontSize: 28 }} />, title: 'Real-time', desc: 'Instant notifications for events and updates', color: 'bg-emerald-600' },
              { icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />, title: 'Achievements', desc: 'Celebrate student and club milestones', color: 'bg-orange-500' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{card.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Login Cards ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Chip label="Get Started" size="small" sx={{ mb: 2, bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 600 }} />
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Choose your portal</h2>
            <p className="text-slate-500">Select your role to access your personalized dashboard.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {LOGIN_CARDS.map((card) => (
              <button
                key={card.role}
                onClick={() => navigate('/login', { state: { role: card.role } })}
                className={`${card.color} text-white rounded-2xl p-6 text-left transition-all duration-200 hover:scale-105 hover:shadow-xl group`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  {card.icon}
                </div>
                <div className="font-bold text-lg mb-1">{card.label}</div>
                <div className="text-sm opacity-80">{card.desc}</div>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold opacity-90">
                  Login <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to transform your campus?</h2>
          <p className="text-indigo-200 text-lg mb-10">Join thousands of students and faculty already using CampusHub.</p>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: 'white',
              color: '#4f46e5',
              '&:hover': { bgcolor: '#f0f0ff' },
              borderRadius: '10px',
              px: 5,
              py: 1.8,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <SchoolIcon sx={{ fontSize: 14, color: 'white' }} />
            </div>
            <span className="text-white font-bold">CampusHub</span>
          </div>
          <p className="text-sm">© 2025 CampusHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
