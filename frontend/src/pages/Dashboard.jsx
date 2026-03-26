import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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

const results = [
  { subject: 'Data Structures', mid: 28, max: 30 },
  { subject: 'DBMS', mid: 24, max: 30 },
  { subject: 'Computer Networks', mid: 26, max: 30 },
  { subject: 'OS', mid: 22, max: 30 },
  { subject: 'Math III', mid: 27, max: 30 },
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    toast.success(`Welcome back, ${user.name}! 👋`, { id: 'welcome' });
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const tabs = ['overview', 'attendance', 'assignments', 'results', 'timetable'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <nav className="bg-blue-900 text-white px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">🎓 CampusHub</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition"
          >
            📢 Campus Feed
          </button>
          <span className="text-blue-200 text-sm">
            {user?.name} · <span className="capitalize">{user?.role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-900 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-50 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">Academic Year 2024–25 · Semester VI</p>
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
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">🏆 Mid-Semester Results</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium text-center">Marks Obtained</th>
                  <th className="pb-3 font-medium text-center">Max Marks</th>
                  <th className="pb-3 font-medium text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const pct = (r.mid / r.max) * 100;
                  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : 'C';
                  return (
                    <tr key={r.subject} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800">{r.subject}</td>
                      <td className="py-3 text-center text-blue-700 font-bold">{r.mid}</td>
                      <td className="py-3 text-center text-gray-400">{r.max}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          grade === 'A+' ? 'bg-green-100 text-green-700' :
                          grade === 'A' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
      </div>
    </div>
  );
}
