import { useNavigate } from 'react-router-dom';

export default function LandingFaculty() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800 text-white">
      <nav className="flex items-center justify-between px-8 py-5">
        <span className="text-2xl font-bold tracking-tight">🎓 CampusHub</span>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="text-emerald-200 hover:text-white text-sm transition">Student?</button>
          <button onClick={() => navigate('/admin')} className="text-emerald-200 hover:text-white text-sm transition">Admin?</button>
          <button onClick={() => navigate('/login-faculty')} className="bg-white text-emerald-800 font-semibold px-5 py-2 rounded-full hover:bg-emerald-50 transition">
            Faculty Login
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="text-6xl mb-4">👨‍🏫</div>
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Faculty Portal <br /> Teach. Track. Inspire.
        </h1>
        <p className="text-emerald-200 text-lg max-w-xl mb-8">
          Manage your classes, mark attendance, upload materials, post assignments, and track student progress effortlessly.
        </p>
        <button onClick={() => navigate('/login-faculty')} className="bg-white text-emerald-800 font-bold px-8 py-3 rounded-full text-lg hover:bg-emerald-50 transition shadow-lg">
          Enter Faculty Panel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 pb-20 max-w-5xl mx-auto">
        {[
          { icon: '📋', title: 'Mark Attendance', desc: 'Quickly mark and manage attendance for your classes.' },
          { icon: '📝', title: 'Assignments', desc: 'Create, assign, and review student assignments.' },
          { icon: '📊', title: 'Student Progress', desc: 'Track individual and class-wide academic performance.' },
          { icon: '📁', title: 'Study Material', desc: 'Upload notes, slides, and resources for students.' },
          { icon: '📅', title: 'Schedule', desc: 'View your teaching schedule and upcoming classes.' },
          { icon: '📢', title: 'Announcements', desc: 'Post class-specific or department-wide notices.' },
        ].map((f) => (
          <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/20 transition">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-xl font-bold mb-1">{f.title}</h3>
            <p className="text-emerald-200 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
