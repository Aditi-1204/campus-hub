import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';
import { T } from '../../utils/theme';

const sidebarItems = [
  { key: 'students',  label: 'Student Details',  icon: '👥' },
  { key: 'timetable', label: 'Manage Timetable', icon: '🗓️' },
];

// ─── Student Details ──────────────────────────────────────────────────────────

function StudentDetails() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/admin/students')
      .then((res) => setStudents(res.data.students))
      .catch((err) => setError(err.message || 'Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) ||
           s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: T.navy }}>Student Details</h2>
          <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>
            {loading ? 'Loading...' : `${students.length} students registered`}
          </p>
        </div>
        <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 w-64"
          style={{ borderColor: T.border, focusRingColor: T.aqua }} />
      </div>

      {loading && (
        <div className="space-y-3">
          {[1,2,3,4].map((i) => (
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
          <div><p className="font-semibold text-sm">Failed to load students</p><p className="text-xs text-red-400 mt-0.5">{error}</p></div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: T.textMuted }}>
          <div className="text-4xl mb-3">👥</div>
          <p className="font-medium">{search ? 'No students match your search.' : 'No students registered yet.'}</p>
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
              {filtered.map((s, idx) => (
                <tr key={s._id} className="border-t hover:bg-gray-50 transition" style={{ borderColor: T.border }}>
                  <td className="px-6 py-3 font-medium" style={{ color: T.textMuted }}>{idx + 1}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: T.aqua }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{s.email}</td>
                  <td className="px-6 py-3 text-xs" style={{ color: T.textMuted }}>
                    {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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

// ─── Manage Timetable ─────────────────────────────────────────────────────────

function ManageTimetable() {
  const [timetable, setTimetable] = useState([
    { day: 'Monday',    slots: ['Data Structures', 'DBMS', 'OS Lab', 'Math III'] },
    { day: 'Tuesday',   slots: ['Computer Networks', 'Math III', 'DSA Lab', 'Elective'] },
    { day: 'Wednesday', slots: ['OS', 'DBMS Lab', 'Elective', 'Data Structures'] },
    { day: 'Thursday',  slots: ['Data Structures', 'Computer Networks', 'Math III', 'OS'] },
    { day: 'Friday',    slots: ['OS', 'DBMS', 'Project Work', 'Computer Networks'] },
  ]);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');

  const startEdit = (di, si) => { setEditing({ di, si }); setEditVal(timetable[di].slots[si]); };
  const saveEdit = () => {
    if (!editing) return;
    setTimetable(timetable.map((row, di) =>
      di === editing.di ? { ...row, slots: row.slots.map((s, si) => si === editing.si ? editVal : s) } : row
    ));
    setEditing(null);
  };

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: T.navy }}>Manage Timetable</h2>
        <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>Click any cell to edit the subject</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={T.tableHead} className="text-white">
              <th className="px-5 py-3 text-left font-semibold">Day</th>
              {timeSlots.map((t) => <th key={t} className="px-5 py-3 text-left font-semibold">{t}</th>)}
            </tr>
          </thead>
          <tbody>
            {timetable.map((row, di) => (
              <tr key={row.day} className="border-t hover:bg-gray-50 transition" style={{ borderColor: T.border }}>
                <td className="px-5 py-3 font-bold" style={{ color: T.navy }}>{row.day}</td>
                {row.slots.map((slot, si) => (
                  <td key={si} className="px-5 py-3">
                    {editing?.di === di && editing?.si === si ? (
                      <div className="flex gap-2">
                        <input value={editVal} onChange={(e) => setEditVal(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()} autoFocus
                          className="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 w-32"
                          style={{ borderColor: T.aqua }} />
                        <button onClick={saveEdit} className="text-xs font-semibold px-2 py-1 rounded-lg text-white" style={{ background: T.aqua }}>✓</button>
                        <button onClick={() => setEditing(null)} className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-100 text-gray-600">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(di, si)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-80 transition text-left w-full"
                        style={{ background: T.aquaLight, color: T.navy }}>
                        {slot} <span className="ml-1 text-gray-300">✏️</span>
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-3" style={{ color: T.textMuted }}>* Changes are local only.</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminStudentPortal() {
  const [active, setActive] = useState('students');
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen" style={{ background: T.bg }}>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <AdminSidebar title="Student Portal" items={sidebarItems} activeKey={active} onSelect={setActive} open={open} onToggle={() => setOpen(!open)} />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {active === 'students'  && <StudentDetails />}
          {active === 'timetable' && <ManageTimetable />}
        </main>
      </div>
    </div>
  );
}
