import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CircularProgress, Chip, Button } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import api from '../../api';

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [fetching, setFetching] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/student/events');
      setEvents(data.data);
      setFiltered(data.data);
    } catch { toast.error('Failed to load events'); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    let list = events.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      (e.venue || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q)
    );
    if (filter === 'upcoming') list = list.filter((e) => new Date(e.date) >= new Date());
    if (filter === 'past') list = list.filter((e) => new Date(e.date) < new Date());
    if (filter === 'registered') list = list.filter((e) => e.isRegistered);
    setFiltered(list);
  }, [search, filter, events]);

  const handleRegister = async (event) => {
    setLoadingId(event._id);
    try {
      if (event.isRegistered) {
        await api.delete(`/student/events/${event._id}/unregister`);
        toast.success('Unregistered from event');
      } else {
        await api.post(`/student/events/${event._id}/register`);
        toast.success('Registered successfully!');
      }
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setLoadingId(null); }
  };

  const isUpcoming = (date) => new Date(date) >= new Date();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <EventIcon sx={{ color: '#2563eb' }} /> Events
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Browse and register for campus events</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 20 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
        </div>
        <div className="flex gap-2">
          {['all', 'upcoming', 'past', 'registered'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><CircularProgress sx={{ color: '#2563eb' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <EventIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
          <p className="font-semibold text-slate-600">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((e) => {
            const upcoming = isUpcoming(e.date);
            return (
              <div key={e._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
                {/* Banner */}
                <div className={`h-24 flex flex-col items-center justify-center relative ${upcoming ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
                  <span className="text-3xl font-extrabold text-white leading-none">{new Date(e.date).getDate()}</span>
                  <span className="text-blue-200 text-xs font-semibold">
                    {new Date(e.date).toLocaleString('default', { month: 'short' })} {new Date(e.date).getFullYear()}
                  </span>
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${upcoming ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-200'}`}>
                      {upcoming ? 'Upcoming' : 'Past'}
                    </span>
                    {e.isRegistered && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">Registered</span>
                    )}
                  </div>
                </div>
                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">{e.title}</h3>
                  {e.club && <Chip label={e.club.name} size="small" sx={{ mb: 1, alignSelf: 'flex-start', bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.6rem' }} />}
                  <p className="text-xs text-slate-400 leading-relaxed flex-1 line-clamp-2 mb-2">
                    {e.description || 'No description provided.'}
                  </p>
                  <div className="space-y-1 mb-3">
                    {e.time && <div className="flex items-center gap-1 text-xs text-slate-400"><AccessTimeIcon sx={{ fontSize: 12 }} />{e.time}</div>}
                    {e.venue && <div className="flex items-center gap-1 text-xs text-slate-400"><LocationOnIcon sx={{ fontSize: 12 }} /><span className="truncate">{e.venue}</span></div>}
                    <div className="flex items-center gap-1 text-xs text-slate-400"><PeopleIcon sx={{ fontSize: 12 }} />{e.registrationCount} registered</div>
                  </div>
                  <Button
                    variant={e.isRegistered ? 'outlined' : 'contained'}
                    size="small"
                    fullWidth
                    disabled={loadingId === e._id || !upcoming}
                    onClick={() => handleRegister(e)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      ...(e.isRegistered
                        ? { borderColor: '#ef4444', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2', borderColor: '#dc2626' } }
                        : { bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }),
                    }}
                  >
                    {loadingId === e._id
                      ? <CircularProgress size={14} sx={{ color: 'inherit' }} />
                      : !upcoming ? 'Event Ended'
                      : e.isRegistered ? 'Unregister' : 'Register'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
