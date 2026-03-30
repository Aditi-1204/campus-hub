import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

// ── Helpers ───────────────────────────────────────────────────────────────────
function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const TYPE_BADGE = {
  placement: 'bg-orange-50 text-orange-600 border border-orange-200',
  event:     'bg-blue-50   text-blue-600   border border-blue-200',
  club:      'bg-purple-50 text-purple-600 border border-purple-200',
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}{title}
      </h2>
      {action && (
        <button onClick={onAction}
          className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline">
          {action} <ArrowForwardIcon sx={{ fontSize: 13 }} />
        </button>
      )}
    </div>
  );
}

// ── Event bar chart (events per month, last 6 months) ────────────────────────
function EventChart({ events }) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleString('default', { month: 'short' }), month: d.getMonth(), year: d.getFullYear(), count: 0 };
  });
  events.forEach((e) => {
    const d = new Date(e.date);
    const slot = months.find((m) => m.month === d.getMonth() && m.year === d.getFullYear());
    if (slot) slot.count++;
  });
  const max = Math.max(...months.map((m) => m.count), 1);

  return (
    <div className="flex items-end gap-2 h-24 mt-2">
      {months.map((m) => (
        <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-indigo-600">{m.count || ''}</span>
          <div className="w-full rounded-t-lg transition-all duration-500"
            style={{
              height: `${Math.max((m.count / max) * 72, m.count ? 8 : 4)}px`,
              background: m.count ? 'linear-gradient(180deg,#6366f1,#818cf8)' : '#e0e7ff',
            }} />
          <span className="text-xs text-gray-400">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ClubDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/club/clubs'),
      api.get('/club/events'),
    ]).then(([c, e]) => {
      setClubs(c.data.data);
      setEvents(e.data.data);
      // Build notifications from recent clubs + events (no extra API needed)
      const notifs = [
        ...c.data.data.slice(0, 3).map((cl) => ({
          _id: cl._id, title: 'Club Created', message: `${cl.name} was added`, type: 'club', createdAt: cl.createdAt,
        })),
        ...e.data.data.slice(0, 3).map((ev) => ({
          _id: ev._id, title: 'Event Scheduled', message: `${ev.title} on ${formatDate(ev.date)}`, type: 'event', createdAt: ev.createdAt,
        })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      setNotifications(notifs);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const totalMembers = clubs.reduce((sum, c) => sum + (c.members?.length || 0), 0);

  const STATS = [
    { label: 'Total Clubs',     value: clubs.length,          icon: <GroupsIcon sx={{ fontSize: 20 }} />,        bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    { label: 'Total Events',    value: events.length,         icon: <EventIcon sx={{ fontSize: 20 }} />,          bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100'   },
    { label: 'Upcoming Events', value: upcomingEvents.length, icon: <CalendarMonthIcon sx={{ fontSize: 20 }} />,  bg: 'bg-emerald-50',text: 'text-emerald-600',border: 'border-emerald-100'},
    { label: 'Total Members',   value: totalMembers,          icon: <PeopleIcon sx={{ fontSize: 20 }} />,         bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  ];

  return (
    <div className="bg-gray-50 min-h-full">

      {/* ── Header ── */}
      <div className="mb-7">
        <p className="text-gray-400 text-sm">{greeting},</p>
        <h1 className="text-2xl font-bold text-gray-900">{user?.name} 👋</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your clubs and events from here.</p>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        <button onClick={() => navigate('/club/clubs')}
          className="rounded-2xl p-5 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 group"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <GroupsIcon sx={{ color: 'white', fontSize: 22 }} />
          </div>
          <p className="font-bold text-lg text-white">Manage Clubs</p>
          <p className="text-purple-200 text-sm mt-0.5">Create or edit your clubs</p>
          <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-white/80 group-hover:text-white">
            Go <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </div>
        </button>
        <button onClick={() => navigate('/club/events')}
          className="rounded-2xl p-5 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 group"
          style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)' }}>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <EventIcon sx={{ color: 'white', fontSize: 22 }} />
          </div>
          <p className="font-bold text-lg text-white">Manage Events</p>
          <p className="text-blue-200 text-sm mt-0.5">Create or edit your events</p>
          <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-white/80 group-hover:text-white">
            Go <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </div>
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {STATS.map((s) => (
          <Card key={s.label} className="!p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? <CircularProgress size={18} sx={{ color: '#4F46E5' }} /> : s.value}
            </div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
              <TrendingUpIcon sx={{ fontSize: 13 }} /> Active
            </div>
          </Card>
        ))}
      </div>

      {/* ── Row: Upcoming Events + Recent Clubs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Upcoming Events */}
        <Card>
          <SectionHeader
            icon={<EventIcon sx={{ color: '#4F46E5', fontSize: 18 }} />}
            title="Upcoming Events"
            action="View All"
            onAction={() => navigate('/club/events')}
          />
          {loading
            ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#4F46E5' }} /></div>
            : upcomingEvents.length === 0
              ? (
                <div className="text-center py-10">
                  <EventIcon sx={{ fontSize: 32, color: '#e2e8f0' }} />
                  <p className="text-gray-400 text-sm mt-2">No upcoming events</p>
                  <button onClick={() => navigate('/club/events')}
                    className="text-xs text-indigo-600 font-semibold mt-2 hover:underline">Create one →</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 3).map((e) => (
                    <div key={e._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-base font-bold leading-none">{new Date(e.date).getDate()}</span>
                        <span className="text-indigo-400 text-xs">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{e.title}</p>
                        <div className="flex gap-2 text-xs text-gray-400 mt-0.5">
                          {e.time && <span className="flex items-center gap-0.5"><AccessTimeIcon sx={{ fontSize: 11 }} />{e.time}</span>}
                          {e.venue && <span className="flex items-center gap-0.5"><LocationOnIcon sx={{ fontSize: 11 }} />{e.venue}</span>}
                        </div>
                      </div>
                      {e.club && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 whitespace-nowrap">
                          {e.club.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
        </Card>

        {/* Recent Club Activity */}
        <Card>
          <SectionHeader
            icon={<GroupsIcon sx={{ color: '#7c3aed', fontSize: 18 }} />}
            title="Recent Club Activity"
            action="View All"
            onAction={() => navigate('/club/clubs')}
          />
          {loading
            ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#7c3aed' }} /></div>
            : clubs.length === 0
              ? (
                <div className="text-center py-10">
                  <GroupsIcon sx={{ fontSize: 32, color: '#e2e8f0' }} />
                  <p className="text-gray-400 text-sm mt-2">No clubs yet</p>
                  <button onClick={() => navigate('/club/clubs')}
                    className="text-xs text-purple-600 font-semibold mt-2 hover:underline">Create one →</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {clubs.slice(0, 4).map((c) => (
                    <div key={c._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {c.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.category || 'General'}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                        <PeopleIcon sx={{ fontSize: 13 }} />
                        <span>{c.members?.length || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </Card>
      </div>

      {/* ── Row: Notifications + Chart ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Notifications Panel */}
        <Card>
          <SectionHeader
            icon={<NotificationsNoneIcon sx={{ color: '#4F46E5', fontSize: 18 }} />}
            title="Recent Activity"
          />
          {loading
            ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#4F46E5' }} /></div>
            : notifications.length === 0
              ? <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
              : (
                <div className="space-y-3">
                  {notifications.map((n, i) => (
                    <div key={n._id || i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-gray-800 truncate">{n.title}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap capitalize flex-shrink-0 ${TYPE_BADGE[n.type] || 'bg-gray-100 text-gray-500'}`}>
                            {n.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{n.message}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{relativeTime(n.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
        </Card>

        {/* Events per Month Chart */}
        <Card>
          <SectionHeader
            icon={<TrendingUpIcon sx={{ color: '#4F46E5', fontSize: 18 }} />}
            title="Events This Period"
          />
          {loading
            ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#4F46E5' }} /></div>
            : <EventChart events={events} />}
          <p className="text-xs text-gray-400 mt-3 text-center">Events created over the last 6 months</p>
        </Card>
      </div>

    </div>
  );
}
