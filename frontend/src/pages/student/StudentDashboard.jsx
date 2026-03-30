import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Chip, LinearProgress } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ForumIcon from '@mui/icons-material/Forum';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

// ── Static data for non-overview tabs ────────────────────────────────────────
const ATTENDANCE = [
  { subject: 'Data Structures',       attended: 38, total: 42 },
  { subject: 'Operating Systems',     attended: 30, total: 40 },
  { subject: 'Computer Networks',     attended: 35, total: 38 },
  { subject: 'Database Management',   attended: 28, total: 36 },
  { subject: 'Software Engineering',  attended: 22, total: 30 },
];

const ASSIGNMENTS = [
  { title: 'Binary Tree Implementation',   subject: 'Data Structures',      due: 'Jul 18, 2025', status: 'Pending'   },
  { title: 'Process Scheduling Report',    subject: 'Operating Systems',    due: 'Jul 15, 2025', status: 'Submitted' },
  { title: 'TCP/IP Protocol Analysis',     subject: 'Computer Networks',    due: 'Jul 10, 2025', status: 'Overdue'   },
  { title: 'ER Diagram — Library System',  subject: 'Database Management',  due: 'Jul 20, 2025', status: 'Pending'   },
  { title: 'SDLC Case Study',              subject: 'Software Engineering', due: 'Jul 22, 2025', status: 'Submitted' },
  { title: 'Graph Traversal Assignment',   subject: 'Data Structures',      due: 'Jul 08, 2025', status: 'Overdue'   },
];

const RESULTS = [
  { subject: 'Data Structures',       marks: 88, total: 100, grade: 'A'  },
  { subject: 'Operating Systems',     marks: 74, total: 100, grade: 'B+' },
  { subject: 'Computer Networks',     marks: 91, total: 100, grade: 'A+' },
  { subject: 'Database Management',   marks: 67, total: 100, grade: 'B'  },
  { subject: 'Software Engineering',  marks: 82, total: 100, grade: 'A'  },
  { subject: 'Mathematics III',       marks: 79, total: 100, grade: 'B+' },
];

const TIMETABLE = [
  { day: 'Monday',    slots: ['9:00 Data Structures', '11:00 Maths III', '2:00 Lab: DS'] },
  { day: 'Tuesday',   slots: ['10:00 OS', '12:00 CN', '3:00 DBMS'] },
  { day: 'Wednesday', slots: ['9:00 SE', '11:00 Data Structures', '2:00 Lab: CN'] },
  { day: 'Thursday',  slots: ['10:00 Maths III', '12:00 OS', '3:00 Lab: DBMS'] },
  { day: 'Friday',    slots: ['9:00 CN', '11:00 SE', '1:00 Seminar'] },
];

// Static fallback notices shown when API returns nothing
const STATIC_NOTICES = [
  { title: 'Mid-Semester Exam Schedule Released', message: 'Check the academic portal for your exam timetable.', type: 'notice', createdAt: new Date(Date.now() - 86400000) },
  { title: 'Library Book Return Reminder',        message: 'All borrowed books must be returned by July 20.',     type: 'notice', createdAt: new Date(Date.now() - 172800000) },
  { title: 'Hackathon Registration Open',         message: 'Register before July 15 to participate.',             type: 'event',  createdAt: new Date(Date.now() - 259200000) },
  { title: 'Campus Wi-Fi Maintenance',            message: 'Network downtime on July 14 from 2–4 AM.',            type: 'notice', createdAt: new Date(Date.now() - 345600000) },
];

const DEADLINES = [
  { title: 'Binary Tree Implementation',  subject: 'Data Structures',     due: 'Jul 18', urgent: true  },
  { title: 'ER Diagram Submission',       subject: 'Database Management', due: 'Jul 20', urgent: false },
  { title: 'SDLC Case Study',             subject: 'Software Engineering', due: 'Jul 22', urgent: false },
];



const TABS = [
  { key: 'overview',       label: 'Overview',       icon: <BarChartIcon sx={{ fontSize: 16 }} />       },
  { key: 'attendance',     label: 'Attendance',     icon: <StarIcon sx={{ fontSize: 16 }} />            },
  { key: 'assignments',    label: 'Assignments',    icon: <AssignmentIcon sx={{ fontSize: 16 }} />      },
  { key: 'results',        label: 'Results',        icon: <BarChartIcon sx={{ fontSize: 16 }} />        },
  { key: 'timetable',      label: 'Timetable',      icon: <CalendarTodayIcon sx={{ fontSize: 16 }} />   },
  { key: 'communication',  label: 'Communication',  icon: <ForumIcon sx={{ fontSize: 16 }} />           },
];

const STATUS_STYLE = {
  Pending:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Submitted: 'bg-green-50  text-green-700  border border-green-200',
  Overdue:   'bg-red-50    text-red-600    border border-red-200',
};

const GRADE_COLOR = { 'A+': '#4F46E5', A: '#059669', 'B+': '#0284c7', B: '#d97706', C: '#dc2626' };

// ── Helpers ──────────────────────────────────────────────────────────────────
function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const TYPE_BADGE = {
  placement: 'bg-orange-50 text-orange-600 border border-orange-200',
  event:     'bg-blue-50   text-blue-600   border border-blue-200',
  club:      'bg-purple-50 text-purple-600 border border-purple-200',
  notice:    'bg-gray-100  text-gray-500   border border-gray-200',
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-sm font-semibold text-gray-700 mb-4">{children}</h2>;
}

// ── Tab content components ────────────────────────────────────────────────────
function AttendanceTab() {
  return (
    <Card>
      <SectionTitle>Subject-wise Attendance</SectionTitle>
      <div className="space-y-5">
        {ATTENDANCE.map((a) => {
          const pct = Math.round((a.attended / a.total) * 100);
          const color = pct >= 75 ? '#4F46E5' : pct >= 60 ? '#f59e0b' : '#ef4444';
          return (
            <div key={a.subject}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{a.subject}</span>
                <span className="font-semibold" style={{ color }}>
                  {a.attended}/{a.total} &nbsp;({pct}%)
                </span>
              </div>
              <LinearProgress
                variant="determinate" value={pct}
                sx={{ height: 8, borderRadius: 8, bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 8 } }}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function AssignmentsTab() {
  return (
    <Card>
      <SectionTitle>My Assignments</SectionTitle>
      <div className="space-y-3">
        {ASSIGNMENTS.map((a, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-semibold text-gray-800 truncate">{a.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.subject} · Due {a.due}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[a.status]}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ResultsTab() {
  const avg = Math.round(RESULTS.reduce((s, r) => s + r.marks, 0) / RESULTS.length);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {RESULTS.map((r) => (
          <Card key={r.subject} className="!p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700 leading-snug">{r.subject}</p>
              <span className="text-lg font-extrabold ml-2" style={{ color: GRADE_COLOR[r.grade] || '#374151' }}>
                {r.grade}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{r.marks}<span className="text-sm font-normal text-gray-400">/{r.total}</span></p>
            <LinearProgress variant="determinate" value={(r.marks / r.total) * 100}
              sx={{ mt: 1.5, height: 6, borderRadius: 6, bgcolor: '#f1f5f9',
                '& .MuiLinearProgress-bar': { bgcolor: GRADE_COLOR[r.grade] || '#4F46E5', borderRadius: 6 } }} />
          </Card>
        ))}
      </div>
      <Card className="!p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <BarChartIcon sx={{ color: '#4F46E5', fontSize: 28 }} />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Semester Average</p>
          <p className="text-3xl font-extrabold text-gray-900">{avg}<span className="text-base font-normal text-gray-400">/100</span></p>
        </div>
      </Card>
    </div>
  );
}

function TimetableTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {TIMETABLE.map((d) => (
        <Card key={d.day} className="!p-4">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3">{d.day}</p>
          <div className="space-y-2">
            {d.slots.map((s, i) => (
              <div key={i} className="text-xs bg-indigo-50 text-indigo-700 font-medium px-3 py-2 rounded-lg">{s}</div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function NotificationList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((n, i) => (
        <div key={n._id || i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <p className="text-sm font-semibold text-gray-800 leading-snug">{n.title}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 capitalize ${TYPE_BADGE[n.type] || TYPE_BADGE.notice}`}>
                {n.type}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{relativeTime(n.createdAt)}</span>
        </div>
      ))}
    </div>
  );
}

function CommunicationTab({ notifications }) {
  return (
    <Card>
      <SectionTitle>Notifications & Updates</SectionTitle>
      <NotificationList items={notifications} />
    </Card>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myClubs, setMyClubs] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/student/my-clubs'),
      api.get('/student/my-events'),
      api.get('/student/clubs'),
      api.get('/placement'),
      api.get('/student/notifications'),
    ]).then(([c, e, ac, p, n]) => {
      setMyClubs(c.data.data);
      setMyEvents(e.data.data);
      setAppliedCount(p.data.data.filter((x) => x.hasApplied).length);
      setNotifications(n.data.data.length ? n.data.data : STATIC_NOTICES);
    }).catch(() => { setNotifications(STATIC_NOTICES); }).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const upcomingEvents = myEvents.filter((e) => new Date(e.date) >= new Date());

  const STATS = [
    { label: 'Clubs Joined',      value: myClubs.length,       icon: <GroupsIcon sx={{ fontSize: 20 }} />,  bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', to: '/student/my-activities' },
    { label: 'Events Registered', value: myEvents.length,      icon: <EventIcon sx={{ fontSize: 20 }} />,   bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100',   to: '/student/my-activities' },
    { label: 'Upcoming Events',   value: upcomingEvents.length, icon: <StarIcon sx={{ fontSize: 20 }} />,   bg: 'bg-emerald-50',text: 'text-emerald-600',border: 'border-emerald-100',to: '/student/events'        },
    { label: 'Applications',      value: appliedCount,          icon: <WorkIcon sx={{ fontSize: 20 }} />,   bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', to: '/student/my-activities' },
  ];

  return (
    <div className="bg-gray-50 min-h-full">

      {/* ── Header ── */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm">{greeting},</p>
        <h1 className="text-2xl font-bold text-gray-900">{user?.name} 👋</h1>
        <p className="text-gray-400 text-sm mt-0.5">Welcome back to your student portal.</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-7 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === t.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Attendance ── */}
      {activeTab === 'attendance' && <AttendanceTab />}

      {/* ── Tab: Assignments ── */}
      {activeTab === 'assignments' && <AssignmentsTab />}

      {/* ── Tab: Results ── */}
      {activeTab === 'results' && <ResultsTab />}

      {/* ── Tab: Timetable ── */}
      {activeTab === 'timetable' && <TimetableTab />}

      {/* ── Tab: Communication ── */}
      {activeTab === 'communication' && <CommunicationTab notifications={notifications} />}

      {/* ── Tab: Overview ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Row 1 — Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <button key={s.label} onClick={() => navigate(s.to)}
                className={`bg-white rounded-2xl border ${s.border} p-5 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.text} flex items-center justify-center mb-3`}>
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? <CircularProgress size={18} sx={{ color: '#4F46E5' }} /> : s.value}
                </div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
              </button>
            ))}
          </div>

          {/* Row 2 — Upcoming Events + My Clubs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* My Upcoming Events */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <EventIcon sx={{ color: '#4F46E5', fontSize: 18 }} /> My Upcoming Events
                </h2>
                <button onClick={() => navigate('/student/my-activities')}
                  className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline">
                  View all <ArrowForwardIcon sx={{ fontSize: 13 }} />
                </button>
              </div>
              {loading
                ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#4F46E5' }} /></div>
                : upcomingEvents.length === 0
                  ? (
                    <div className="text-center py-8">
                      <EventIcon sx={{ fontSize: 32, color: '#e2e8f0' }} />
                      <p className="text-gray-400 text-sm mt-2">No upcoming events</p>
                      <button onClick={() => navigate('/student/events')}
                        className="text-xs text-indigo-600 font-semibold mt-2 hover:underline">Browse events →</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingEvents.slice(0, 4).map((e) => (
                        <div key={e._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
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
                          {e.club && <Chip label={e.club.name} size="small" sx={{ bgcolor: '#ede9fe', color: '#7c3aed', fontWeight: 600, fontSize: '0.6rem' }} />}
                        </div>
                      ))}
                    </div>
                  )}
            </Card>

            {/* My Clubs */}
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GroupsIcon sx={{ color: '#7c3aed', fontSize: 18 }} /> My Clubs
                </h2>
                <button onClick={() => navigate('/student/clubs')}
                  className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5 hover:underline">
                  Browse more <ArrowForwardIcon sx={{ fontSize: 13 }} />
                </button>
              </div>
              {loading
                ? <div className="flex justify-center py-8"><CircularProgress sx={{ color: '#7c3aed' }} /></div>
                : myClubs.length === 0
                  ? (
                    <div className="text-center py-8">
                      <GroupsIcon sx={{ fontSize: 32, color: '#e2e8f0' }} />
                      <p className="text-gray-400 text-sm mt-2">You haven't joined any clubs</p>
                      <button onClick={() => navigate('/student/clubs')}
                        className="text-xs text-purple-600 font-semibold mt-2 hover:underline">Explore clubs →</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myClubs.slice(0, 4).map((c) => (
                        <div key={c._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {c.name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                            {c.category && <p className="text-xs text-gray-400">{c.category}</p>}
                          </div>
                          <Chip label="Joined" size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.6rem' }} />
                        </div>
                      ))}
                    </div>
                  )}
            </Card>
          </div>

          {/* Row 3 — Recent Notices + Study Streak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Recent Notices — live from API */}
            <Card>
              <div className="flex items-center gap-2 mb-5">
                <NotificationsNoneIcon sx={{ color: '#4F46E5', fontSize: 18 }} />
                <h2 className="text-sm font-semibold text-gray-700">Recent Notices</h2>
              </div>
              {loading
                ? <div className="flex justify-center py-6"><CircularProgress size={20} sx={{ color: '#4F46E5' }} /></div>
                : <NotificationList items={notifications.slice(0, 4)} />}
            </Card>

            {/* Study Streak */}
            <div className="rounded-2xl p-6 shadow-sm text-white flex flex-col justify-between"
              style={{ background: 'linear-gradient(135deg, #f97316 0%, #7c3aed 100%)' }}>
              <div className="flex items-center gap-2 mb-4">
                <LocalFireDepartmentIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }} />
                <h2 className="text-sm font-semibold text-white/90">Study Streak</h2>
              </div>
              <div>
                <p className="text-6xl font-extrabold leading-none">12</p>
                <p className="text-lg font-semibold mt-1 text-white/90">Days</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-sm text-white/80 leading-relaxed">
                  🔥 You're on a roll! Keep studying daily to maintain your streak.
                </p>
              </div>
            </div>
          </div>

          {/* Row 4 — Upcoming Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Upcoming Deadlines */}
            <Card>
              <div className="flex items-center gap-2 mb-5">
                <AssignmentIcon sx={{ color: '#4F46E5', fontSize: 18 }} />
                <h2 className="text-sm font-semibold text-gray-700">Upcoming Deadlines</h2>
              </div>
              <div className="space-y-3">
                {DEADLINES.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.urgent ? 'bg-red-500' : 'bg-yellow-400'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{d.title}</p>
                        <p className="text-xs text-gray-400">{d.subject}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ml-3 ${
                      d.urgent ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {d.due}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Spacer — balanced layout */}
            <div />
          </div>

        </div>
      )}
    </div>
  );
}
