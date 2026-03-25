import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">🎓 CampusHub</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-blue-800 font-semibold px-5 py-2 rounded-full hover:bg-blue-50 transition"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-24">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Your College. <br /> All in One Place.
        </h1>
        <p className="text-blue-200 text-lg max-w-xl mb-8">
          CampusHub is your all-in-one ERP platform for managing academics, attendance, results, notices, and more — built for students and faculty.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-blue-800 font-bold px-8 py-3 rounded-full text-lg hover:bg-blue-50 transition shadow-lg"
        >
          Get Started
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 pb-20 max-w-5xl mx-auto">
        {[
          { icon: '📚', title: 'Academics', desc: 'Track courses, timetables, and assignments in one place.' },
          { icon: '📋', title: 'Attendance', desc: 'Monitor your attendance and get alerts for low attendance.' },
          { icon: '📢', title: 'Notices', desc: 'Stay updated with college announcements and events.' },
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
