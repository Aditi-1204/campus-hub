import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { T } from '../../utils/theme';

const sidebarItems = [
  { key: 'clubs',  label: 'Club Details',  icon: '🏅' },
  { key: 'events', label: 'Manage Events', icon: '📅' },
];

const defaultEvents = [
  { id: 1, title: 'Annual Tech Fest',    club: 'Tech Club',         date: '2025-08-15', status: 'Upcoming',  desc: 'Annual technology festival with hackathon and project expo.' },
  { id: 2, title: 'Cultural Night',      club: 'Cultural Club',     date: '2025-07-28', status: 'Upcoming',  desc: 'A night of music, dance and drama performances.' },
  { id: 3, title: 'Sports Meet',         club: 'Sports Club',       date: '2025-07-10', status: 'Completed', desc: 'Inter-department sports competition.' },
  { id: 4, title: 'Photography Walk',    club: 'Photography Club',  date: '2025-08-05', status: 'Upcoming',  desc: 'Campus photography walk and exhibition.' },
  { id: 5, title: 'Debate Championship', club: 'Debate Club',       date: '2025-06-20', status: 'Completed', desc: 'Inter-college debate competition.' },
];

// ─── Club Details ─────────────────────────────────────────────────────────────

function ClubDetails() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/admin/club-leaders')
      .then((res) => setLeaders(res.data.clubLeaders))
      .catch((err) => setError(err.message || 'Failed to load club leaders'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leaders.filter(
    (l) => l.name.toLowerCase().includes(search.toLowerCase()) ||
           l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: T.navy }}>Club Details</h2>
          <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>
            {loading ? 'Loading...' : `${leaders.length} club leaders registered`}
          </p>
        </div>
        <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 w-64"
          style={{ borderColor: T.border }} />
      </div>

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-2xl px-6 py-4 animate-pulse flex items-center gap-4" style={{ border: `1px solid ${T.border}` }}>
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2"><div className="h-3 bg-gray-200 rounded w-1/3" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-5 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div><p className="font-semibold text-sm">Failed to load club leaders</p><p className="text-xs text-red-400 mt-0.5">{error}</p></div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: T.textMuted }}>
          <div className="text-4xl mb-3">🏅</div>
          <p className="font-medium">{search ? 'No club leaders match your search.' : 'No club leaders registered yet.'}</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={T.tableHead} className="text-white">
                <th className="px-6 py-3 text-left font-semibold">#</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, idx) => (
                <tr key={l._id} className="border-t hover:bg-gray-50 transition" style={{ borderColor: T.border }}>
                  <td className="px-6 py-3 font-medium" style={{ color: T.textMuted }}>{idx + 1}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: T.aqua }}>
                        {l.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{l.email}</td>
                  <td className="px-6 py-3 text-xs" style={{ color: T.textMuted }}>
                    {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Manage Events ────────────────────────────────────────────────────────────

function ManageEvents() {
  const [events, setEvents] = useState(defaultEvents);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', club: '', date: '', desc: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.club || !form.date) return;
    setEvents([...events, { id: Date.now(), ...form, status: 'Upcoming' }]);
    setForm({ title: '', club: '', date: '', desc: '' });
    setShowForm(false);
  };

  const statusStyle = (s) => s === 'Upcoming'
    ? { background: T.aquaLight, color: T.navy }
    : { background: '#F0FDF4', color: '#16A34A' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: T.navy }}>Manage Events</h2>
          <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>{events.length} events listed</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition hover:opacity-90"
          style={{ background: showForm ? '#6B7280' : T.aqua }}>
          {showForm ? '✕ Cancel' : '+ Add Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-4" style={{ border: `1px solid ${T.border}` }}>
          <div className="grid grid-cols-2 gap-4">
            {[['title','Event Title *','e.g. Tech Fest 2025'],['club','Club Name *','e.g. Tech Club'],['desc','Description','Brief description...']].map(([name, label, ph]) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
                <input value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} placeholder={ph}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2" style={{ borderColor: T.border }} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2" style={{ borderColor: T.border }} />
            </div>
          </div>
          <button type="submit" className="text-sm font-semibold px-6 py-2.5 rounded-xl text-white hover:opacity-90 transition" style={{ background: T.navy }}>
            Add Event
          </button>
        </form>
      )}

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between hover:shadow-md transition" style={{ border: `1px solid ${T.border}` }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: T.aquaLight }}>📅</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{ev.title}</p>
                <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>{ev.club} · {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {ev.desc && <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>{ev.desc}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={statusStyle(ev.status)}>{ev.status}</span>
              <button onClick={() => setEvents(events.filter((e) => e.id !== ev.id))}
                className="text-xs text-red-400 hover:text-red-600 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminClubPortal() {
  const [active, setActive] = useState('clubs');
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen" style={{ background: T.bg }}>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <AdminSidebar title="Club Portal" items={sidebarItems} activeKey={active} onSelect={setActive} open={open} onToggle={() => setOpen(!open)} />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {active === 'clubs'  && <ClubDetails />}
          {active === 'events' && <ManageEvents />}
        </main>
      </div>
    </div>
  );
}
