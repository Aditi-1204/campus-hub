import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Navbar from '../components/Navbar';

const stats = [
  { icon: '📚', label: 'Courses Enrolled', value: '6' },
  { icon: '✅', label: 'Attendance', value: '82%' },
  { icon: '📝', label: 'Assignments Due', value: '3' },
  { icon: '🏆', label: 'CGPA', value: '8.4' },
];

const notices = [
  { title: 'Mid-Semester Exams', date: 'July 20, 2025', tag: 'Exam', tagColor: 'bg-red-100 text-red-600' },
  { title: 'Annual Sports Day Registration', date: 'July 15, 2025', tag: 'Event', tagColor: 'bg-green-100 text-green-600' },
  { title: 'Library Fine Waiver Week', date: 'July 10, 2025', tag: 'Notice', tagColor: 'bg-blue-100 text-blue-600' },
  { title: 'Scholarship Form Deadline', date: 'July 8, 2025', tag: 'Important', tagColor: 'bg-yellow-100 text-yellow-600' },
];

const timetable = [
  { day: 'Mon', subjects: ['Data Structures', 'DBMS', 'OS Lab'] },
  { day: 'Tue', subjects: ['Computer Networks', 'Math III', 'DSA Lab'] },
  { day: 'Wed', subjects: ['OS', 'DBMS Lab', 'Elective'] },
  { day: 'Thu', subjects: ['Data Structures', 'Computer Networks', 'Math III'] },
  { day: 'Fri', subjects: ['OS', 'DBMS', 'Project Work'] },
];

const assignments = [
  { subject: 'Data Structures', title: 'Implement AVL Tree', due: 'July 18, 2025', status: 'Pending' },
  { subject: 'DBMS', title: 'ER Diagram for Library System', due: 'July 16, 2025', status: 'Submitted' },
  { subject: 'Computer Networks', title: 'TCP/IP Protocol Report', due: 'July 22, 2025', status: 'Pending' },
  { subject: 'Math III', title: 'Fourier Series Problems', due: 'July 14, 2025', status: 'Submitted' },
];

const attendance = [
  { subject: 'Data Structures', percent: 88 },
  { subject: 'DBMS', percent: 75 },
  { subject: 'Computer Networks', percent: 92 },
  { subject: 'OS', percent: 68 },
  { subject: 'Math III', percent: 85 },
];

const currentSem = 4;

const gradePoint = (g) => ({ O: 10, E: 9, A: 8, B: 7, C: 6, D: 5, F: 0 }[g] ?? 0);
const getGrade = (m, mx) => { const p = (m / mx) * 100; return p >= 90 ? 'O' : p >= 80 ? 'E' : p >= 70 ? 'A' : p >= 60 ? 'B' : p >= 50 ? 'C' : p >= 40 ? 'D' : 'F'; };
const calcSGPA = (subjects) => {
  const totalCredits = subjects.reduce((a, b) => a + b.credits, 0);
  const weightedSum = subjects.reduce((a, b) => a + b.credits * gradePoint(getGrade(b.marks, b.max)), 0);
  return (weightedSum / totalCredits).toFixed(2);
};

const semResults = [
  {
    sem: 1,
    subjects: [
      { subject: 'Engineering Mathematics I', marks: 72, max: 100, credits: 4 },
      { subject: 'Engineering Physics', marks: 65, max: 100, credits: 3 },
      { subject: 'Basic Electrical Engineering', marks: 70, max: 100, credits: 3 },
      { subject: 'Programming in C', marks: 80, max: 100, credits: 4 },
      { subject: 'Engineering Graphics', marks: 68, max: 100, credits: 2 },
    ],
  },
  {
    sem: 2,
    subjects: [
      { subject: 'Engineering Mathematics II', marks: 75, max: 100, credits: 4 },
      { subject: 'Engineering Chemistry', marks: 60, max: 100, credits: 3 },
      { subject: 'Digital Electronics', marks: 78, max: 100, credits: 3 },
      { subject: 'Data Structures', marks: 85, max: 100, credits: 4 },
      { subject: 'Object Oriented Programming', marks: 82, max: 100, credits: 4 },
    ],
  },
  {
    sem: 3,
    subjects: [
      { subject: 'Discrete Mathematics', marks: 70, max: 100, credits: 4 },
      { subject: 'Computer Organization', marks: 74, max: 100, credits: 3 },
      { subject: 'Operating Systems', marks: 68, max: 100, credits: 4 },
      { subject: 'Database Management Systems', marks: 88, max: 100, credits: 4 },
      { subject: 'Software Engineering', marks: 76, max: 100, credits: 3 },
    ],
  },
];

const quickLinks = [
  { icon: '📄', label: 'Fee Payment', color: 'bg-purple-100 text-purple-700' },
  { icon: '📖', label: 'Library', color: 'bg-yellow-100 text-yellow-700' },
  { icon: '🎯', label: 'Exam Schedule', color: 'bg-red-100 text-red-700' },
  { icon: '🏅', label: 'Achievements', color: 'bg-green-100 text-green-700' },
  { icon: '📞', label: 'Contact Faculty', color: 'bg-blue-100 text-blue-700' },
  { icon: '🗓️', label: 'Academic Calendar', color: 'bg-indigo-100 text-indigo-700' },
];

export default function Dashboard() {
  const { user, isRole, getUserField } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [commSection, setCommSection] = useState('messaging');
  const [faculty, setFaculty] = useState([]);
  const [sentMsgs, setSentMsgs] = useState([]);
  const [form, setForm] = useState({ receiverId: '', subject: '', body: '', type: 'message' });
  const [sending, setSending] = useState(false);

  const loadCommunication = async () => {
    try {
      const [fRes, sRes] = await Promise.all([
        api.get('/api/messages/faculty'),
        api.get('/api/messages/sent'),
      ]);
      setFaculty(fRes.data);
      setSentMsgs(sRes.data);
    } catch {
      toast.error('Failed to load communication data');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.receiverId) return toast.error('Please select a faculty member');
    setSending(true);
    try {
      await api.post('/api/messages/send', form);
      toast.success('Sent successfully!');
      setForm({ receiverId: '', subject: '', body: '', type: form.type });
      loadCommunication();
    } catch {
      toast.error('Failed to send');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    toast.success(`Welcome back, ${user.name}! 👋`, { id: 'welcome' });
    loadCommunication();
  }, []);

  const tabs = ['overview', 'attendance', 'assignments', 'results', 'timetable', 'communication'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {getUserField('name', 'Student')} 👋</h1>
            <p className="text-gray-500 text-sm">Academic Year 2024–25 · Semester VI {isRole('admin') && <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">Admin</span>}{isRole('faculty') && <span className="ml-2 bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-semibold">Faculty</span>}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-blue-800 font-medium">
            📅 {new Date().toDateString()}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-800 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 text-center hover:shadow-md transition">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold text-blue-800">{s.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notices */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">📢 Recent Notices</h2>
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.title} className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-center justify-between hover:shadow-md transition">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{n.date}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${n.tagColor}`}>{n.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">⚡ Quick Links</h2>
                <div className="grid grid-cols-3 gap-3">
                  {quickLinks.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => toast(`${q.label} — coming soon!`, { icon: q.icon })}
                      className={`${q.color} rounded-xl p-4 text-center hover:opacity-80 transition`}
                    >
                      <div className="text-2xl mb-1">{q.icon}</div>
                      <div className="text-xs font-semibold">{q.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Timetable */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">🕐 Today's Classes</h2>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM'].map((time, i) => (
                  <div key={time} className="bg-white rounded-xl shadow-sm p-4 min-w-[140px] border-l-4 border-blue-500">
                    <p className="text-xs text-gray-400 mb-1">{time}</p>
                    <p className="font-semibold text-gray-800 text-sm">{timetable[0].subjects[i % 3]}</p>
                    <p className="text-xs text-gray-400 mt-1">Room 20{i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">📊 Subject-wise Attendance</h2>
            <div className="space-y-5">
              {attendance.map((a) => (
                <div key={a.subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{a.subject}</span>
                    <span className={`font-bold ${a.percent < 75 ? 'text-red-500' : 'text-green-600'}`}>{a.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${a.percent < 75 ? 'bg-red-400' : 'bg-green-500'}`}
                      style={{ width: `${a.percent}%` }}
                    />
                  </div>
                  {a.percent < 75 && (
                    <p className="text-xs text-red-400 mt-1">⚠️ Below minimum attendance requirement</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">📝 Assignments</h2>
            <div className="space-y-4">
              {assignments.map((a) => (
                <div key={a.title} className="border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-sm transition">
                  <div>
                    <p className="font-semibold text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.subject} · Due: {a.due}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    a.status === 'Submitted' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">🏆 End Semester Results</h2>
              <span className="text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">Current Semester: {currentSem}</span>
            </div>
            {semResults.filter((s) => s.sem < currentSem).map((sem) => {
              const total = sem.subjects.reduce((a, b) => a + b.marks, 0);
              const maxTotal = sem.subjects.reduce((a, b) => a + b.max, 0);
              const pct = ((total / maxTotal) * 100).toFixed(1);
              const sgpa = calcSGPA(sem.subjects);
              const gradeColor = (g) => g === 'O' ? 'bg-purple-100 text-purple-700' : g === 'E' ? 'bg-green-100 text-green-700' : g === 'A' ? 'bg-blue-100 text-blue-700' : g === 'B' ? 'bg-cyan-100 text-cyan-700' : g === 'C' ? 'bg-yellow-100 text-yellow-700' : g === 'D' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700';
              return (
                <div key={sem.sem} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-blue-900 text-base">Semester {sem.sem}</h3>
                    <div className="flex gap-3 text-sm items-center">
                      <span className="text-gray-500">Total: <span className="font-bold text-gray-800">{total}/{maxTotal}</span></span>
                      <span className={`font-bold px-3 py-0.5 rounded-full text-xs ${ pct >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{pct}%</span>
                      <span className="font-bold px-3 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">SGPA: {sgpa}</span>
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="pb-2 font-medium">Subject</th>
                        <th className="pb-2 font-medium text-center">Credits</th>
                        <th className="pb-2 font-medium text-center">Marks</th>
                        <th className="pb-2 font-medium text-center">Max</th>
                        <th className="pb-2 font-medium text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sem.subjects.map((r) => {
                        const grade = getGrade(r.marks, r.max);
                        return (
                          <tr key={r.subject} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2.5 font-medium text-gray-800">{r.subject}</td>
                            <td className="py-2.5 text-center text-gray-500">{r.credits}</td>
                            <td className="py-2.5 text-center text-blue-700 font-bold">{r.marks}</td>
                            <td className="py-2.5 text-center text-gray-400">{r.max}</td>
                            <td className="py-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor(grade)}`}>{grade}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}

        {/* TIMETABLE TAB */}
        {activeTab === 'timetable' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">🗓️ Weekly Timetable</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Day</th>
                    <th className="pb-3 font-medium">9:00 AM</th>
                    <th className="pb-3 font-medium">10:00 AM</th>
                    <th className="pb-3 font-medium">11:00 AM</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((t) => (
                    <tr key={t.day} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-bold text-blue-800">{t.day}</td>
                      {t.subjects.map((s, i) => (
                        <td key={i} className="py-3">
                          <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-lg">{s}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMMUNICATION TAB */}
        {activeTab === 'communication' && (
          <div className="space-y-6">
            {/* Sub-tabs */}
            <div className="flex gap-2">
              {['messaging', 'doubts', 'feedback'].map((s) => (
                <button
                  key={s}
                  onClick={() => setCommSection(s)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    commSection === s ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {s === 'messaging' ? '💬 Messaging' : s === 'doubts' ? '🙋 Doubt Clearing' : '⭐ Teacher Feedback'}
                </button>
              ))}
            </div>

            {/* Compose */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                {commSection === 'messaging' ? '💬 Send a Message' : commSection === 'doubts' ? '🙋 Ask a Doubt' : '⭐ Give Feedback'}
              </h2>
              <form onSubmit={handleSend} className="space-y-4">
                <select
                  value={form.receiverId}
                  onChange={(e) => setForm({ ...form, receiverId: e.target.value, type: commSection === 'messaging' ? 'message' : commSection === 'doubts' ? 'doubt' : 'feedback' })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Faculty Member</option>
                  {faculty.length === 0 && <option disabled>No faculty registered yet</option>}
                  {faculty.map((f) => (
                    <option key={f._id} value={f._id}>{f.name} — {f.email}</option>
                  ))}
                </select>
                <input
                  placeholder={commSection === 'feedback' ? 'Subject (e.g. Feedback for Data Structures)' : 'Subject'}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  rows={4}
                  placeholder={commSection === 'doubts' ? 'Describe your doubt in detail...' : commSection === 'feedback' ? 'Share your feedback about the faculty or subject...' : 'Write your message...'}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-900 transition disabled:opacity-60"
                >
                  {sending ? 'Sending...' : commSection === 'feedback' ? 'Submit Feedback' : 'Send'}
                </button>
              </form>
            </div>

            {/* Sent history */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                📤 Sent {commSection === 'messaging' ? 'Messages' : commSection === 'doubts' ? 'Doubts' : 'Feedback'}
              </h2>
              {sentMsgs.filter((m) => m.type === (commSection === 'messaging' ? 'message' : commSection === 'doubts' ? 'doubt' : 'feedback')).length === 0 ? (
                <p className="text-gray-400 text-sm">Nothing sent yet.</p>
              ) : (
                <div className="space-y-4">
                  {sentMsgs
                    .filter((m) => m.type === (commSection === 'messaging' ? 'message' : commSection === 'doubts' ? 'doubt' : 'feedback'))
                    .map((m) => (
                      <div key={m._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-800 text-sm">{m.subject}</p>
                          <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">To: {m.receiver?.name}</p>
                        <p className="text-sm text-gray-600">{m.body}</p>
                        {m.reply ? (
                          <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3">
                            <p className="text-xs font-semibold text-green-700 mb-1">✅ Reply from {m.receiver?.name}:</p>
                            <p className="text-sm text-green-800">{m.reply}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(m.repliedAt).toLocaleDateString()}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-orange-400 mt-2">⏳ Awaiting reply...</p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
