import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function ClubDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/club/clubs'), api.get('/club/events')])
      .then(([c, e]) => { setClubs(c.data.data); setEvents(e.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date());

  return (
    <div>
      <div className="mb-8">
        <p className="text-slate-500 text-sm">{greeting},</p>
        <h1 className="text-3xl font-extrabold text-slate-900">{user?.name} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your clubs and events from here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <GroupsIcon />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {loading ? <CircularProgress size={24} sx={{ color: '#7c3aed' }} /> : clubs.length}
          </div>
          <div className="text-sm text-slate-500 font-medium">Clubs Created</div>
        </div>
        <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <EventIcon />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {loading ? <CircularProgress size={24} sx={{ color: '#2563eb' }} /> : events.length}
          </div>
          <div className="text-sm text-slate-500 font-medium">Events Created</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button onClick={() => navigate('/club/clubs')}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl p-5 text-left transition-all hover:shadow-lg group">
          <GroupsIcon sx={{ fontSize: 28, mb: 1 }} />
          <p className="font-bold text-lg">Manage Clubs</p>
          <p className="text-purple-200 text-sm mt-1">Create or edit your clubs</p>
          <div className="mt-3 flex items-center gap-1 text-sm font-semibold opacity-80 group-hover:opacity-100">
            Go <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </div>
        </button>
        <button onClick={() => navigate('/club/events')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 text-left transition-all hover:shadow-lg group">
          <EventIcon sx={{ fontSize: 28, mb: 1 }} />
          <p className="font-bold text-lg">Manage Events</p>
          <p className="text-blue-200 text-sm mt-1">Create or edit your events</p>
          <div className="mt-3 flex items-center gap-1 text-sm font-semibold opacity-80 group-hover:opacity-100">
            Go <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </div>
        </button>
      </div>

      {/* Upcoming events preview */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <EventIcon sx={{ color: '#2563eb', fontSize: 20 }} /> Upcoming Events
          </h2>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 3).map((e) => (
              <div key={e._id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {new Date(e.date).getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{e.title}</p>
                  <p className="text-xs text-slate-400">{e.time || ''} {e.venue ? `· ${e.venue}` : ''}</p>
                </div>
                {e.club && <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-lg">{e.club.name}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
