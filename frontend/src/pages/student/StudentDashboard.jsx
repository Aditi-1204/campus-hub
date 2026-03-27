import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Chip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../../context/AuthContext';
import WorkIcon from '@mui/icons-material/Work';
import api from '../../api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myClubs, setMyClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [allClubs, setAllClubs] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/student/my-clubs'),
      api.get('/student/my-events'),
      api.get('/student/clubs'),
      api.get('/placement'),
    ]).then(([c, e, ac, p]) => {
      setMyClubs(c.data.data);
      setMyEvents(e.data.data);
      setAllClubs(ac.data.data);
      setAppliedCount(p.data.data.filter((x) => x.hasApplied).length);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const upcomingEvents = myEvents.filter((e) => new Date(e.date) >= new Date());

  const STATS = [
    { label: 'Clubs Joined', value: myClubs.length, icon: <GroupsIcon />, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', to: '/student/my-activities' },
    { label: 'Events Registered', value: myEvents.length, icon: <EventIcon />, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', to: '/student/my-activities' },
    { label: 'Upcoming Events', value: upcomingEvents.length, icon: <StarIcon />, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', to: '/student/events' },
    { label: 'Applications', value: appliedCount, icon: <WorkIcon />, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', to: '/student/my-activities' },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-slate-500 text-sm">{greeting},</p>
        <h1 className="text-3xl font-extrabold text-slate-900">{user?.name} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome to your student portal. Explore clubs and events.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {STATS.map((s) => (
          <button key={s.label} onClick={() => navigate(s.to)}
            className={`bg-white rounded-2xl border ${s.border} p-5 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition-all`}>
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {loading ? <CircularProgress size={20} /> : s.value}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming registered events */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <EventIcon sx={{ color: '#2563eb', fontSize: 20 }} /> My Upcoming Events
            </h2>
            <button onClick={() => navigate('/student/my-activities')} className="text-xs text-blue-600 font-semibold flex items-center gap-0.5 hover:underline">
              View all <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
          {loading ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#2563eb' }} /></div>
            : upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <EventIcon sx={{ fontSize: 36, color: '#e2e8f0', mb: 1 }} />
                <p className="text-slate-400 text-sm">No upcoming events</p>
                <button onClick={() => navigate('/student/events')} className="text-xs text-blue-600 font-semibold mt-2 hover:underline">Browse events →</button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 4).map((e) => (
                  <div key={e._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex flex-col items-center justify-center text-xs font-bold flex-shrink-0">
                      <span className="text-base font-extrabold leading-none">{new Date(e.date).getDate()}</span>
                      <span className="text-blue-400 text-xs">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{e.title}</p>
                      <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                        {e.time && <span className="flex items-center gap-0.5"><AccessTimeIcon sx={{ fontSize: 11 }} />{e.time}</span>}
                        {e.venue && <span className="flex items-center gap-0.5"><LocationOnIcon sx={{ fontSize: 11 }} />{e.venue}</span>}
                      </div>
                    </div>
                    {e.club && <Chip label={e.club.name} size="small" sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.6rem' }} />}
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* My clubs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <GroupsIcon sx={{ color: '#7c3aed', fontSize: 20 }} /> My Clubs
            </h2>
            <button onClick={() => navigate('/student/clubs')} className="text-xs text-blue-600 font-semibold flex items-center gap-0.5 hover:underline">
              Browse more <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
          {loading ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#7c3aed' }} /></div>
            : myClubs.length === 0 ? (
              <div className="text-center py-8">
                <GroupsIcon sx={{ fontSize: 36, color: '#e2e8f0', mb: 1 }} />
                <p className="text-slate-400 text-sm">You haven't joined any clubs</p>
                <button onClick={() => navigate('/student/clubs')} className="text-xs text-purple-600 font-semibold mt-2 hover:underline">Explore clubs →</button>
              </div>
            ) : (
              <div className="space-y-3">
                {myClubs.slice(0, 4).map((c) => (
                  <div key={c._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-extrabold flex-shrink-0">
                      {c.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                      {c.category && <p className="text-xs text-slate-400">{c.category}</p>}
                    </div>
                    <Chip label="Joined" size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.6rem' }} />
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
