import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PercentIcon from '@mui/icons-material/Percent';
import GradeIcon from '@mui/icons-material/Grade';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Attendance', value: 'attendance' },
  { label: 'Assignments', value: 'assignments' },
  { label: 'Results', value: 'results' },
  { label: 'Timetable', value: 'timetable' },
  { label: 'Communication', value: 'communication' },
];

const NOTICES = [
  {
    title: 'End Semester Examination Schedule Released',
    date: 'Jul 10, 2025',
    badge: 'Exam',
    badgeColor: '#ef4444',
    badgeBg: '#fef2f2',
  },
  {
    title: 'Annual Tech Fest Registration Open',
    date: 'Jul 8, 2025',
    badge: 'Event',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
  },
  {
    title: 'Library Timings Extended During Exam Week',
    date: 'Jul 6, 2025',
    badge: 'Notice',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
  },
];

const QUICK_LINKS = [
  { label: 'Fee Payment', icon: <PaymentIcon />, from: '#6366f1', to: '#818cf8' },
  { label: 'Library', icon: <LocalLibraryIcon />, from: '#0ea5e9', to: '#38bdf8' },
  { label: 'Exam Schedule', icon: <AssignmentIcon />, from: '#f59e0b', to: '#fbbf24' },
  { label: 'Achievements', icon: <EmojiEventsIcon />, from: '#10b981', to: '#34d399' },
  { label: 'Contact Faculty', icon: <ContactMailIcon />, from: '#ec4899', to: '#f472b6' },
  { label: 'Academic Calendar', icon: <CalendarMonthIcon />, from: '#8b5cf6', to: '#a78bfa' },
];

const DEADLINES = [
  { title: 'Data Structures Assignment', due: 'Jul 14', subject: 'CS301', urgent: true },
  { title: 'DBMS Lab Report', due: 'Jul 16', subject: 'CS302', urgent: false },
  { title: 'OS Mini Project', due: 'Jul 20', subject: 'CS303', urgent: false },
];

const ATTENDANCE_SUBJECTS = [
  { name: 'Data Structures', pct: 88 },
  { name: 'DBMS', pct: 76 },
  { name: 'Operating Systems', pct: 91 },
  { name: 'Computer Networks', pct: 72 },
];

const INITIAL_TODOS = [
  { id: 1, text: 'Submit DS Assignment', done: false },
  { id: 2, text: 'Prepare for DBMS viva', done: true },
  { id: 3, text: 'Read CN Chapter 5', done: false },
];

const ASSIGNMENTS = [
  { title: 'Data Structures Assignment', subject: 'CS301', due: 'Jul 14, 2025', status: 'Pending' },
  { title: 'DBMS Lab Report', subject: 'CS302', due: 'Jul 16, 2025', status: 'Pending' },
  { title: 'OS Mini Project', subject: 'CS303', due: 'Jul 20, 2025', status: 'Submitted' },
  { title: 'Computer Networks Quiz', subject: 'CS304', due: 'Jul 12, 2025', status: 'Overdue' },
];

const RESULTS = [
  { subject: 'Data Structures', marks: 91, grade: 'A+' },
  { subject: 'DBMS', marks: 84, grade: 'A' },
  { subject: 'Operating Systems', marks: 89, grade: 'A' },
  { subject: 'Computer Networks', marks: 78, grade: 'B+' },
  { subject: 'Software Engineering', marks: 87, grade: 'A' },
];

const TIMETABLE = [
  { day: 'Monday', slots: ['DS - 9:00 AM', 'DBMS - 11:00 AM', 'OS Lab - 2:00 PM'] },
  { day: 'Tuesday', slots: ['CN - 10:00 AM', 'SE - 12:00 PM', 'Library - 3:00 PM'] },
  { day: 'Wednesday', slots: ['DS - 9:00 AM', 'OS - 11:00 AM', 'DBMS Lab - 2:00 PM'] },
  { day: 'Thursday', slots: ['CN - 10:00 AM', 'SE - 12:00 PM', 'Project - 2:00 PM'] },
  { day: 'Friday', slots: ['DS Tutorial - 9:00 AM', 'OS - 11:00 AM', 'Seminar - 1:00 PM'] },
];

const COMMUNICATIONS = [
  {
    from: 'Prof. Sharma',
    title: 'DBMS Viva Schedule',
    message: 'DBMS viva will be conducted this Friday in Lab 2. Please be present 10 minutes early.',
    date: 'Jul 11, 2025',
  },
  {
    from: 'Training & Placement Cell',
    title: 'Campus Drive Update',
    message: 'Aptitude round for the upcoming campus drive starts next week. Registration closes tomorrow.',
    date: 'Jul 10, 2025',
  },
  {
    from: 'Library',
    title: 'Book Return Reminder',
    message: 'You have 2 books due for return by Jul 15, 2025. Avoid late fee by returning on time.',
    date: 'Jul 9, 2025',
  },
];

const getStatusStyles = (status) => {
  if (status === 'Submitted') {
    return { color: '#059669', bg: '#ecfdf5' };
  }
  if (status === 'Overdue') {
    return { color: '#dc2626', bg: '#fef2f2' };
  }
  return { color: '#d97706', bg: '#fffbeb' };
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading] = useState(false);
  const [todos, setTodos] = useState(INITIAL_TODOS);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const examDate = new Date('2025-11-15');
  const daysToExam = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));

  const STATS = [
    {
      label: 'Courses Enrolled',
      value: 6,
      icon: <MenuBookIcon sx={{ fontSize: 22 }} />,
      grad: 'linear-gradient(135deg,#6366f1,#818cf8)',
    },
    {
      label: 'Attendance',
      value: '82%',
      icon: <PercentIcon sx={{ fontSize: 22 }} />,
      grad: 'linear-gradient(135deg,#10b981,#34d399)',
    },
    {
      label: 'Assignments Due',
      value: 3,
      icon: <AssignmentIcon sx={{ fontSize: 22 }} />,
      grad: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    },
    {
      label: 'CGPA',
      value: '8.4',
      icon: <GradeIcon sx={{ fontSize: 22 }} />,
      grad: 'linear-gradient(135deg,#ec4899,#f472b6)',
    },
  ];

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    border: '1px solid #f1f5f9',
  };

  const renderOverview = () => (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 18,
          marginBottom: 28,
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '22px 20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              cursor: 'default',
              transition: 'all 0.25s ease',
              border: '1px solid #f1f5f9',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: s.grad,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: 14,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {s.icon}
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {loading ? <CircularProgress size={22} /> : s.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#94a3b8',
                fontWeight: 600,
                marginTop: 6,
                letterSpacing: 0.3,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: '#eff6ff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EventIcon sx={{ fontSize: 16, color: '#2563eb' }} />
              </span>
              Recent Notices
            </h2>
            <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>View all →</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NOTICES.map((n, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#1e293b',
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {n.title}
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: 20,
                      background: n.badgeBg,
                      color: n.badgeColor,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {n.badge}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '5px 0 0', fontWeight: 500 }}>
                  {n.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: '#f5f3ff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StarIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
            </span>
            Quick Links
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {QUICK_LINKS.map((q, i) => (
              <button
                key={i}
                style={{
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: `linear-gradient(135deg,${q.from},${q.to})`,
                  color: '#fff',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{q.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.3 }}>{q.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <TimerIcon sx={{ fontSize: 17, color: '#f59e0b' }} /> Upcoming Deadlines
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DEADLINES.map((d, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: d.urgent ? '#fff7ed' : '#f8fafc',
                  border: `1px solid ${d.urgent ? '#fed7aa' : '#f1f5f9'}`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: d.urgent ? '#f59e0b' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AssignmentIcon
                    sx={{ fontSize: 16, color: d.urgent ? '#fff' : '#94a3b8' }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#1e293b',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {d.title}
                  </p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>
                    {d.subject} · Due {d.due}
                  </p>
                </div>

                {d.urgent && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      background: '#f59e0b',
                      color: '#fff',
                      padding: '2px 7px',
                      borderRadius: 20,
                    }}
                  >
                    SOON
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              background: 'linear-gradient(135deg,#f97316,#fb923c)',
              borderRadius: 20,
              padding: '20px 22px',
              color: '#fff',
              boxShadow: '0 4px 18px rgba(249,115,22,0.3)',
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <LocalFireDepartmentIcon sx={{ fontSize: 28 }} />
              <div>
                <p
                  style={{
                    fontSize: 11,
                    opacity: 0.85,
                    margin: 0,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  STUDY STREAK
                </p>
                <p style={{ fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 }}>
                  12 Days 🔥
                </p>
              </div>
            </div>
            <p style={{ fontSize: 11, opacity: 0.8, margin: 0 }}>Keep it up! You&apos;re on a roll.</p>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
              borderRadius: 20,
              padding: '20px 22px',
              color: '#fff',
              boxShadow: '0 4px 18px rgba(124,58,237,0.3)',
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <TimerIcon sx={{ fontSize: 26 }} />
              <div>
                <p
                  style={{
                    fontSize: 11,
                    opacity: 0.85,
                    margin: 0,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  EXAM COUNTDOWN
                </p>
                <p style={{ fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 }}>
                  {daysToExam} Days
                </p>
              </div>
            </div>
            <p style={{ fontSize: 11, opacity: 0.8, margin: 0 }}>End Sem · Nov 15, 2025</p>
          </div>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 17, color: '#10b981' }} /> To-Do List
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todos.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTodo(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: t.done ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${t.done ? '#bbf7d0' : '#f1f5f9'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {t.done ? (
                  <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981', flexShrink: 0 }} />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{ fontSize: 18, color: '#cbd5e1', flexShrink: 0 }}
                  />
                )}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: t.done ? '#94a3b8' : '#1e293b',
                    textDecoration: t.done ? 'line-through' : 'none',
                  }}
                >
                  {t.text}
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#94a3b8', margin: '12px 0 0', textAlign: 'right' }}>
            {todos.filter((t) => t.done).length}/{todos.length} completed
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 17, color: '#0ea5e9' }} /> Attendance by Subject
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ATTENDANCE_SUBJECTS.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{s.name}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: s.pct < 75 ? '#ef4444' : '#10b981',
                    }}
                  >
                    {s.pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 7,
                    borderRadius: 10,
                    background: '#f1f5f9',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 10,
                      width: `${s.pct}%`,
                      background:
                        s.pct < 75
                          ? 'linear-gradient(90deg,#ef4444,#f87171)'
                          : 'linear-gradient(90deg,#10b981,#34d399)',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg,#1e293b,#334155)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 26, color: '#fff' }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 11,
                  opacity: 0.7,
                  margin: 0,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                ACHIEVEMENT
              </p>
              <p style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>Top Performer 🏆</p>
            </div>
          </div>

          <p style={{ fontSize: 13, opacity: 0.75, margin: '0 0 18px', lineHeight: 1.6 }}>
            You ranked in the <strong style={{ color: '#fbbf24' }}>top 10%</strong> of your batch
            last semester. Keep up the excellent work!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[{ label: 'Rank', val: '#4' }, { label: 'CGPA', val: '8.4' }, { label: 'Credits', val: '120' }].map(
              (m, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '10px 8px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fbbf24' }}>
                    {m.val}
                  </p>
                  <p style={{ fontSize: 10, opacity: 0.65, margin: '3px 0 0', fontWeight: 600 }}>
                    {m.label}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderAttendance = () => (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 20px',
        }}
      >
        Attendance Overview
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 18,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: '#eff6ff',
            borderRadius: 18,
            padding: 20,
            border: '1px solid #dbeafe',
          }}
        >
          <p style={{ margin: 0, color: '#64748b', fontSize: 12, fontWeight: 600 }}>
            Overall Attendance
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 34, fontWeight: 800, color: '#1d4ed8' }}>
            82%
          </p>
        </div>

        <div
          style={{
            background: '#f0fdf4',
            borderRadius: 18,
            padding: 20,
            border: '1px solid #bbf7d0',
          }}
        >
          <p style={{ margin: 0, color: '#64748b', fontSize: 12, fontWeight: 600 }}>
            Subjects Above 75%
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 34, fontWeight: 800, color: '#059669' }}>
            {ATTENDANCE_SUBJECTS.filter((s) => s.pct >= 75).length}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ATTENDANCE_SUBJECTS.map((subject, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: 18,
              background: '#fff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                  {subject.name}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                  Minimum required: 75%
                </p>
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: subject.pct < 75 ? '#ef4444' : '#10b981',
                }}
              >
                {subject.pct}%
              </span>
            </div>

            <div
              style={{
                height: 10,
                borderRadius: 999,
                background: '#e2e8f0',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${subject.pct}%`,
                  borderRadius: 999,
                  background:
                    subject.pct < 75
                      ? 'linear-gradient(90deg,#ef4444,#f87171)'
                      : 'linear-gradient(90deg,#10b981,#34d399)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 20px',
        }}
      >
        Assignments
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ASSIGNMENTS.map((item, index) => {
          const status = getStatusStyles(item.status);

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                alignItems: 'center',
                padding: 18,
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                background: '#fff',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                  {item.title}
                </p>
                <p style={{ margin: '5px 0 0', fontSize: 12, color: '#64748b' }}>
                  {item.subject} · Due {item.due}
                </p>
              </div>

              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: status.bg,
                  color: status.color,
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderResults = () => (
    <div style={cardStyle}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 18,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: '#f5f3ff',
            borderRadius: 18,
            padding: 20,
            border: '1px solid #ddd6fe',
          }}
        >
          <p style={{ margin: 0, color: '#64748b', fontSize: 12, fontWeight: 600 }}>CGPA</p>
          <p style={{ margin: '8px 0 0', fontSize: 34, fontWeight: 800, color: '#7c3aed' }}>
            8.4
          </p>
        </div>

        <div
          style={{
            background: '#eff6ff',
            borderRadius: 18,
            padding: 20,
            border: '1px solid #dbeafe',
          }}
        >
          <p style={{ margin: 0, color: '#64748b', fontSize: 12, fontWeight: 600 }}>
            Best Subject Score
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 34, fontWeight: 800, color: '#2563eb' }}>
            91
          </p>
        </div>
      </div>

      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 20px',
        }}
      >
        Subject Results
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
        {RESULTS.map((result, index) => (
          <div
            key={index}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: 18,
            }}
          >
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              {result.subject}
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800, color: '#1e293b' }}>
              {result.marks}
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
              Grade: <strong>{result.grade}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 20px',
        }}
      >
        Weekly Timetable
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
        {TIMETABLE.map((dayItem, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: 18,
              background: '#fff',
            }}
          >
            <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: '#1d4ed8' }}>
              {dayItem.day}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dayItem.slots.map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#334155',
                  }}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 20px',
        }}
      >
        Communication
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {COMMUNICATIONS.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: 18,
              background: '#fff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                  {item.title}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>
                  {item.from}
                </p>
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>{item.date}</span>
            </div>

            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 28,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 4, fontWeight: 500 }}>
            {greeting} 👋
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
            Academic Year 2024–25 &nbsp;·&nbsp; Semester VI &nbsp;·&nbsp; B.Tech Computer Science
          </p>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg,#1e40af,#3b82f6)',
            borderRadius: 18,
            padding: '14px 22px',
            color: '#fff',
            textAlign: 'right',
            minWidth: 180,
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
          }}
        >
          <p
            style={{
              fontSize: 11,
              opacity: 0.8,
              margin: 0,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Today
          </p>
          <p style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 2px' }}>
            {now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
          </p>
          <p style={{ fontSize: 11, opacity: 0.75, margin: 0 }}>
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: '8px 20px',
              borderRadius: 50,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background:
                activeTab === tab.value
                  ? 'linear-gradient(135deg,#1e40af,#3b82f6)'
                  : '#fff',
              color: activeTab === tab.value ? '#fff' : '#64748b',
              boxShadow:
                activeTab === tab.value
                  ? '0 4px 14px rgba(59,130,246,0.35)'
                  : '0 1px 4px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease',
              transform: activeTab === tab.value ? 'translateY(-1px)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'attendance' && renderAttendance()}
      {activeTab === 'assignments' && renderAssignments()}
      {activeTab === 'results' && renderResults()}
      {activeTab === 'timetable' && renderTimetable()}
      {activeTab === 'communication' && renderCommunication()}
    </div>
  );
}