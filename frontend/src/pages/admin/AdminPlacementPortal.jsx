import { useState } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import { T } from '../../utils/theme';

const sidebarItems = [
  { key: 'drives',     label: 'Placement Drives', icon: '💼' },
  { key: 'add',        label: 'Add Drive',         icon: '➕' },
  { key: 'applicants', label: 'Applicants',         icon: '👥' },
  { key: 'stats',      label: 'Stats',              icon: '📊' },
];

const initialDrives = [
  { id: 1, company: 'TCS',       role: 'Software Engineer', salary: '3.5 LPA', deadline: '2025-08-10' },
  { id: 2, company: 'Infosys',   role: 'Systems Engineer',  salary: '4.0 LPA', deadline: '2025-08-20' },
  { id: 3, company: 'Wipro',     role: 'Project Engineer',  salary: '3.8 LPA', deadline: '2025-09-01' },
  { id: 4, company: 'Capgemini', role: 'Analyst',           salary: '4.5 LPA', deadline: '2025-09-15' },
];

const initialApplicants = [
  { id: 1, name: 'Aditi Sharma',  email: '2301010001@cgu-odisha.ac.in', company: 'TCS',       status: 'Applied' },
  { id: 2, name: 'Rahul Patra',   email: '2301010002@cgu-odisha.ac.in', company: 'Infosys',   status: 'Shortlisted' },
  { id: 3, name: 'Priya Das',     email: '2301010003@cgu-odisha.ac.in', company: 'TCS',       status: 'Applied' },
  { id: 4, name: 'Sourav Nayak',  email: '2301010004@cgu-odisha.ac.in', company: 'Wipro',     status: 'Selected' },
  { id: 5, name: 'Sneha Mishra',  email: '2301010005@cgu-odisha.ac.in', company: 'Capgemini', status: 'Applied' },
];

const EMPTY = { company: '', role: '', salary: '', deadline: '' };

// ─── Placement Drives ─────────────────────────────────────────────────────────

function PlacementDrives({ drives, onDelete }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: T.navy }}>Placement Drives</h2>
        <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>{drives.length} active drives</p>
      </div>
      {drives.length === 0 ? (
        <div className="text-center py-16" style={{ color: T.textMuted }}>
          <div className="text-4xl mb-3">💼</div>
          <p className="font-medium">No drives yet. Use "Add Drive" to create one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={T.tableHead} className="text-white">
                {['#','Company','Role','Salary','Deadline','Action'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drives.map((d, idx) => {
                const expired = new Date(d.deadline) < new Date();
                return (
                  <tr key={d.id} className="border-t hover:bg-gray-50 transition" style={{ borderColor: T.border }}>
                    <td className="px-6 py-3" style={{ color: T.textMuted }}>{idx + 1}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: T.navy }}>
                          {d.company.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800">{d.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{d.role}</td>
                    <td className="px-6 py-3 font-semibold text-green-700">{d.salary}</td>
                    <td className="px-6 py-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={expired ? { background: '#FEF2F2', color: '#DC2626' } : { background: T.aquaLight, color: T.navy }}>
                        {new Date(d.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button onClick={() => onDelete(d.id)} className="text-xs text-red-400 hover:text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Add Drive ────────────────────────────────────────────────────────────────

function AddDrive({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.company.trim()) e.company = 'Required';
    if (!form.role.trim()) e.role = 'Required';
    if (!form.salary.trim()) e.salary = 'Required';
    if (!form.deadline) e.deadline = 'Required';
    else if (new Date(form.deadline) < new Date()) e.deadline = 'Must be in the future';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ id: Date.now(), ...form });
    setForm(EMPTY); setErrors({}); setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const Field = ({ name, label, type = 'text', ph }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} value={form[name]} placeholder={ph}
        onChange={(e) => { setForm({ ...form, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${errors[name] ? 'border-red-400 bg-red-50' : ''}`}
        style={{ borderColor: errors[name] ? '#F87171' : T.border }} />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: T.navy }}>Add Placement Drive</h2>
        <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>Fill in the details to add a new drive</p>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm">✅ Drive added successfully!</div>}
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-xl" style={{ border: `1px solid ${T.border}` }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field name="company" label="Company Name *" ph="e.g. Google" />
          <Field name="role"    label="Role / Position *" ph="e.g. Software Engineer" />
          <Field name="salary"  label="Salary / Stipend *" ph="e.g. 12 LPA" />
          <Field name="deadline" label="Deadline *" type="date" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setForm(EMPTY); setErrors({}); }}
              className="flex-1 border font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm text-gray-600" style={{ borderColor: T.border }}>
              Clear
            </button>
            <button type="submit" className="flex-1 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition text-sm" style={{ background: T.aqua }}>
              Add Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Applicants ───────────────────────────────────────────────────────────────

function Applicants({ applicants }) {
  const [search, setSearch] = useState('');
  const filtered = applicants.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase())
  );
  const statusStyle = (s) => ({
    Applied:     { background: T.aquaLight, color: T.navy },
    Shortlisted: { background: '#FFFBEB', color: '#92400E' },
    Selected:    { background: '#F0FDF4', color: '#16A34A' },
    Rejected:    { background: '#FEF2F2', color: '#DC2626' },
  }[s] || { background: '#F3F4F6', color: '#6B7280' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: T.navy }}>Applicants</h2>
          <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>{applicants.length} total applicants</p>
        </div>
        <input placeholder="Search by name or company..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 w-64" style={{ borderColor: T.border }} />
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={T.tableHead} className="text-white">
              {['#','Student','Email','Applied For','Status'].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={a.id} className="border-t hover:bg-gray-50 transition" style={{ borderColor: T.border }}>
                <td className="px-6 py-3" style={{ color: T.textMuted }}>{idx + 1}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: T.aqua }}>
                      {a.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-800">{a.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-500">{a.email}</td>
                <td className="px-6 py-3 font-medium text-gray-700">{a.company}</td>
                <td className="px-6 py-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={statusStyle(a.status)}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Stats({ drives, applicants }) {
  const companies  = [...new Set(drives.map((d) => d.company))].length;
  const selected   = applicants.filter((a) => a.status === 'Selected').length;
  const shortlisted = applicants.filter((a) => a.status === 'Shortlisted').length;

  const cards = [
    { label: 'Total Drives',      value: drives.length,      icon: '💼', bg: T.aquaLight, text: T.navy },
    { label: 'Total Applicants',  value: applicants.length,  icon: '👥', bg: '#FFFBEB',   text: '#92400E' },
    { label: 'Companies Visited', value: companies,           icon: '🏢', bg: '#F0FDF4',   text: '#16A34A' },
    { label: 'Selected',          value: selected,            icon: '✅', bg: '#F0FDF4',   text: '#16A34A' },
    { label: 'Shortlisted',       value: shortlisted,         icon: '⭐', bg: '#FFFBEB',   text: '#92400E' },
    { label: 'Placement Rate',    value: applicants.length ? `${Math.round((selected / applicants.length) * 100)}%` : '0%', icon: '📈', bg: T.aquaLight, text: T.navy },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: T.navy }}>Placement Stats</h2>
        <p className="text-sm mt-0.5" style={{ color: T.textMuted }}>Overview of placement activity</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition" style={{ border: `1px solid ${T.border}` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: c.bg }}>{c.icon}</div>
            <div className="text-3xl font-extrabold mb-1" style={{ color: c.text }}>{c.value}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminPlacementPortal() {
  const [active, setActive] = useState('drives');
  const [open, setOpen] = useState(true);
  const [drives, setDrives] = useState(initialDrives);
  const [applicants] = useState(initialApplicants);

  return (
    <div className="min-h-screen" style={{ background: T.bg }}>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <AdminSidebar title="Placement Portal" items={sidebarItems} activeKey={active} onSelect={setActive}
          open={open} onToggle={() => setOpen(!open)}
          badge={{ label: 'Active Drives', value: drives.length }} />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {active === 'drives'     && <PlacementDrives drives={drives} onDelete={(id) => setDrives((p) => p.filter((d) => d.id !== id))} />}
          {active === 'add'        && <AddDrive onAdd={(d) => { setDrives((p) => [d, ...p]); setActive('drives'); }} />}
          {active === 'applicants' && <Applicants applicants={applicants} />}
          {active === 'stats'      && <Stats drives={drives} applicants={applicants} />}
        </main>
      </div>
    </div>
  );
}
