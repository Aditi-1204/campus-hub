import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const QUICK_LINKS = [
  { label: 'Manage Students', to: '/admin/students', icon: <SchoolIcon />, color: 'bg-blue-600', desc: 'Add, edit or remove students' },
  { label: 'Manage Clubs', to: '/admin/clubs', icon: <GroupsIcon />, color: 'bg-purple-600', desc: 'Oversee club activities' },
  { label: 'Manage Placements', to: '/admin/placements', icon: <WorkIcon />, color: 'bg-emerald-600', desc: 'Track placement listings' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState(null);

  useEffect(() => {
    api.get('/admin/students')
      .then(({ data }) => setStudentCount(data.data.length))
      .catch(() => setStudentCount(0));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-slate-500 text-sm">{greeting},</p>
        <h1 className="text-3xl font-extrabold text-slate-900">{user?.name} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Here's what's happening on your campus today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          {
            label: 'Total Students',
            value: studentCount === null ? <CircularProgress size={20} /> : studentCount,
            icon: <SchoolIcon />,
            color: 'bg-blue-50 text-blue-600',
            border: 'border-blue-100',
          },
          {
            label: 'Active Clubs',
            value: '—',
            icon: <GroupsIcon />,
            color: 'bg-purple-50 text-purple-600',
            border: 'border-purple-100',
          },
          {
            label: 'Placement Listings',
            value: '—',
            icon: <WorkIcon />,
            color: 'bg-emerald-50 text-emerald-600',
            border: 'border-emerald-100',
          },
        ].map((card) => (
          <div key={card.label} className={`bg-white rounded-2xl border ${card.border} p-6 shadow-sm`}>
            <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{card.value}</div>
            <div className="text-sm text-slate-500 font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUpIcon sx={{ fontSize: 20, color: '#4f46e5' }} /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className="bg-white border border-slate-100 rounded-2xl p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${link.color} text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <p className="font-semibold text-slate-800 text-sm">{link.label}</p>
              <p className="text-xs text-slate-400 mt-1">{link.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Go <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
