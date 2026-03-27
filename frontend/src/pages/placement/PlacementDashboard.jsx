import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const TYPES = [
  { key: 'internship', label: 'Internships', icon: <SchoolIcon />, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', to: '/placement/internships' },
  { key: 'job', label: 'Jobs', icon: <WorkIcon />, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', to: '/placement/jobs' },
  { key: 'campus_drive', label: 'Campus Drives', icon: <DirectionsCarIcon />, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', to: '/placement/campus-drives' },
  { key: 'workshop', label: 'Workshops', icon: <BuildIcon />, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', to: '/placement/workshops' },
  { key: 'conference', label: 'Conferences', icon: <EmojiEventsIcon />, color: 'bg-pink-50 text-pink-600', border: 'border-pink-100', to: '/placement/conferences' },
];

export default function PlacementDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/placement/manage').then(({ data }) => {
      const c = {};
      TYPES.forEach((t) => { c[t.key] = data.data.filter((d) => d.type === t.key).length; });
      setCounts(c);
      setRecent(data.data.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="mb-8">
        <p className="text-slate-500 text-sm">{greeting},</p>
        <h1 className="text-3xl font-extrabold text-slate-900">{user?.name} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Manage all placement activities from here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {TYPES.map((t) => (
          <button key={t.key} onClick={() => navigate(t.to)}
            className={`bg-white rounded-2xl border ${t.border} p-5 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition-all`}>
            <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center mb-3`}>{t.icon}</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {loading ? <CircularProgress size={18} /> : (counts[t.key] || 0)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{t.label}</div>
          </button>
        ))}
      </div>

      {/* Recent listings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-5">Recent Listings</h2>
        {loading ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#059669' }} /></div>
          : recent.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No listings yet. Start by creating one from the sidebar.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((r) => {
                const t = TYPES.find((x) => x.key === r.type);
                return (
                  <div key={r._id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className={`w-9 h-9 rounded-lg ${t?.color} flex items-center justify-center flex-shrink-0`}>{t?.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{r.title}</p>
                      <p className="text-xs text-slate-400">{r.company || t?.label} · {r.location || 'Location TBD'}</p>
                    </div>
                    <button onClick={() => navigate(t?.to)} className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5 hover:underline flex-shrink-0">
                      View <ArrowForwardIcon sx={{ fontSize: 13 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}
