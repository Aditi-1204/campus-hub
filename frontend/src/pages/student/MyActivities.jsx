import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CircularProgress, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import api from '../../api';

export default function MyActivities() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('clubs');
  const [myClubs, setMyClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [myPlacements, setMyPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/student/my-clubs'),
      api.get('/student/my-events'),
      api.get('/placement'),
    ])
      .then(([c, e, p]) => {
        setMyClubs(c.data.data);
        setMyEvents(e.data.data);
        setMyPlacements(p.data.data.filter((x) => x.hasApplied));
      })
      .catch(() => toast.error('Failed to load activities'))
      .finally(() => setLoading(false));
  }, []);

  const upcomingEvents = myEvents.filter((e) => new Date(e.date) >= new Date());
  const pastEvents = myEvents.filter((e) => new Date(e.date) < new Date());

  const TABS = [
    { key: 'clubs', label: `Clubs (${myClubs.length})`, icon: <GroupsIcon fontSize="small" /> },
    { key: 'events', label: `Events (${myEvents.length})`, icon: <EventIcon fontSize="small" /> },
    { key: 'placements', label: `Placements (${myPlacements.length})`, icon: <WorkIcon fontSize="small" /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <StarIcon sx={{ color: '#f59e0b' }} /> My Activities
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Your joined clubs, registered events and applications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><CircularProgress sx={{ color: '#2563eb' }} /></div>
      ) : tab === 'clubs' ? (
        <ClubsTab clubs={myClubs} navigate={navigate} />
      ) : tab === 'events' ? (
        <EventsTab upcomingEvents={upcomingEvents} pastEvents={pastEvents} myEvents={myEvents} navigate={navigate} />
      ) : (
        <PlacementsTab placements={myPlacements} navigate={navigate} />
      )}
    </div>
  );
}

function ClubsTab({ clubs, navigate }) {
  if (clubs.length === 0) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
      <GroupsIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
      <p className="font-semibold text-slate-600 mb-1">No clubs joined yet</p>
      <button onClick={() => navigate('/student/clubs')} className="text-sm text-purple-600 font-semibold hover:underline">Browse clubs →</button>
    </div>
  );
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {clubs.map((c) => (
        <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
          <div className="h-20 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl font-extrabold text-white border-2 border-white/30">
              {c.name[0].toUpperCase()}
            </div>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-slate-900 text-sm truncate mb-1">{c.name}</h3>
            {c.category && <Chip label={c.category} size="small" sx={{ mb: 1, alignSelf: 'flex-start', bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.6rem' }} />}
            <p className="text-xs text-slate-400 line-clamp-2 flex-1">{c.description || 'No description.'}</p>
            {c.venue && <div className="flex items-center gap-1 text-xs text-slate-400 mt-2"><LocationOnIcon sx={{ fontSize: 12 }} />{c.venue}</div>}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <Chip label="✓ Member" size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.65rem' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventsTab({ upcomingEvents, pastEvents, myEvents, navigate }) {
  if (myEvents.length === 0) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
      <EventIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
      <p className="font-semibold text-slate-600 mb-1">No events registered yet</p>
      <button onClick={() => navigate('/student/events')} className="text-sm text-blue-600 font-semibold hover:underline">Browse events →</button>
    </div>
  );
  return (
    <div className="space-y-6">
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Upcoming ({upcomingEvents.length})
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((e) => <EventCard key={e._id} event={e} upcoming />)}
          </div>
        </div>
      )}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> Past ({pastEvents.length})
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {pastEvents.map((e) => <EventCard key={e._id} event={e} upcoming={false} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function PlacementsTab({ placements, navigate }) {
  if (placements.length === 0) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
      <WorkIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
      <p className="font-semibold text-slate-600 mb-1">No applications yet</p>
      <button onClick={() => navigate('/student/internships')} className="text-sm text-emerald-600 font-semibold hover:underline">Browse placements →</button>
    </div>
  );
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {placements.map((item) => (
        <div key={item._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
          <div className="h-20 bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center justify-center px-3">
            <p className="text-white font-extrabold text-sm text-center line-clamp-2 leading-tight">{item.title}</p>
            {item.company && <p className="text-white/70 text-xs mt-0.5 truncate">{item.company}</p>}
          </div>
          <div className="p-4 flex flex-col flex-1">
            <Chip label={item.type.replace('_', ' ')} size="small"
              sx={{ mb: 2, alignSelf: 'flex-start', bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.65rem', textTransform: 'capitalize' }} />
            <div className="space-y-1 flex-1">
              {item.location && <div className="flex items-center gap-1 text-xs text-slate-500"><LocationOnIcon sx={{ fontSize: 12 }} />{item.location}</div>}
              {(item.stipend || item.salary) && <div className="flex items-center gap-1 text-xs text-slate-500"><BusinessIcon sx={{ fontSize: 12 }} />{item.stipend || item.salary}</div>}
              {item.deadline && <div className="flex items-center gap-1 text-xs text-slate-500"><CalendarMonthIcon sx={{ fontSize: 12 }} />Deadline: {new Date(item.deadline).toLocaleDateString()}</div>}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <Chip label="✓ Applied" size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.65rem' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventCard({ event: e, upcoming }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <div className={`h-20 flex flex-col items-center justify-center ${upcoming ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
        <span className="text-2xl font-extrabold text-white leading-none">{new Date(e.date).getDate()}</span>
        <span className="text-xs text-blue-200">{new Date(e.date).toLocaleString('default', { month: 'short' })} {new Date(e.date).getFullYear()}</span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-sm truncate mb-1">{e.title}</h3>
        {e.club && <Chip label={e.club.name} size="small" sx={{ mb: 1, alignSelf: 'flex-start', bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.6rem' }} />}
        <div className="space-y-1 mt-1">
          {e.time && <div className="flex items-center gap-1 text-xs text-slate-400"><AccessTimeIcon sx={{ fontSize: 12 }} />{e.time}</div>}
          {e.venue && <div className="flex items-center gap-1 text-xs text-slate-400"><LocationOnIcon sx={{ fontSize: 12 }} /><span className="truncate">{e.venue}</span></div>}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <Chip label="✓ Registered" size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.65rem' }} />
        </div>
      </div>
    </div>
  );
}
