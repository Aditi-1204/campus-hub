import { useNavigate } from 'react-router-dom';

export default function LandingUser() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white">
      <nav className="flex items-center justify-between px-8 py-5">
        <span className="text-2xl font-bold tracking-tight">🎓 CampusHub</span>
        <div className="flex gap-3">
          <button onClick={() => navigate('/admin')} className="text-blue-200 hover:text-white text-sm transition">Admin?</button>
          <button onClick={() => navigate('/faculty')} className="text-blue-200 hover:text-white text-sm transition">Faculty?</button>
          <button onClick={() => navigate('/login')} className="bg-white text-blue-800 font-semibold px-5 py-2 rounded-full hover:bg-blue-50 transition">
            Student Login
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="text-6xl mb-4">🎒</div>
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Welcome, Student! <br /> Your Campus, Simplified.
        </h1>
        <p className="text-blue-200 text-lg max-w-xl mb-8">
          Access your timetable, attendance, results, assignments, and college notices — all from one place.
        </p>
        <button onClick={() => navigate('/login')} className="bg-white text-blue-800 font-bold px-8 py-3 rounded-full text-lg hover:bg-blue-50 transition shadow-lg">
          Get Started
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 pb-20 max-w-5xl mx-auto">
        {[
          { icon: '📚', title: 'Academics', desc: 'Track courses, timetables, and assignments in one place.' },
          { icon: '📋', title: 'Attendance', desc: 'Monitor your attendance and get alerts for low attendance.' },
          { icon: '📝', title: 'Results', desc: 'View your exam results and grade reports instantly.' },
          { icon: '📢', title: 'Notices', desc: 'Stay updated with college announcements and events.' },
          { icon: '📅', title: 'Timetable', desc: 'Check your daily and weekly class schedule.' },
          { icon: '💬', title: 'Feedback', desc: 'Submit feedback for courses and faculty.' },
        ].map((f) => (
          <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/20 transition">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-xl font-bold mb-1">{f.title}</h3>
            <p className="text-blue-200 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
