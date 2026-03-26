import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FILTERS = [
  { key: 'all', label: '🌐 All' },
  { key: 'cultural', label: '🎭 Cultural' },
  { key: 'placement', label: '💼 Placement' },
  { key: 'clubs', label: '🏛️ Clubs' },
  { key: 'speaker', label: '🎤 Speaker Sessions' },
  { key: 'internship', label: '🧑‍💻 Internships' },
];

const POSTS = [
  {
    id: 1,
    category: 'cultural',
    author: 'Cultural Committee',
    avatar: '🎭',
    time: '2h ago',
    title: 'Annual Fest – Utsav 2025',
    description: 'Get ready for 3 days of music, dance, drama and art! Registrations open now. Solo and group events available.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    tags: ['#Utsav2025', '#CulturalFest'],
    likes: 142,
    comments: 38,
  },
  {
    id: 2,
    category: 'placement',
    author: 'Training & Placement Cell',
    avatar: '💼',
    time: '5h ago',
    title: 'TCS Campus Drive – July 28',
    description: 'TCS is visiting campus for recruitment. Eligible: CSE, IT, ECE (2025 batch). CGPA ≥ 7.0. Register by July 22.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80',
    tags: ['#Placement', '#TCS', '#Hiring'],
    likes: 210,
    comments: 54,
  },
  {
    id: 3,
    category: 'clubs',
    author: 'Coding Club',
    avatar: '🏛️',
    time: '1d ago',
    title: 'Hackathon – Build in 24hrs',
    description: 'Join our 24-hour hackathon this weekend. Theme: AI for Social Good. Form teams of 2–4. Prizes worth ₹50,000!',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
    tags: ['#Hackathon', '#CodingClub'],
    likes: 98,
    comments: 21,
  },
  {
    id: 4,
    category: 'speaker',
    author: 'Student Council',
    avatar: '🎤',
    time: '1d ago',
    title: 'Talk by Mr. Arjun Mehta – Ex-Google Engineer',
    description: 'Interactive session on "Breaking into Big Tech". Open to all students. Venue: Seminar Hall A, 4 PM July 19.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
    tags: ['#SpeakerSession', '#BigTech'],
    likes: 175,
    comments: 43,
  },
  {
    id: 5,
    category: 'internship',
    author: 'Internship Cell',
    avatar: '🧑‍💻',
    time: '2d ago',
    title: 'Summer Internship – Infosys BPM',
    description: 'Infosys BPM is offering 2-month paid internships for pre-final year students. Stipend: ₹15,000/month. Apply by July 25.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
    tags: ['#Internship', '#Infosys'],
    likes: 189,
    comments: 60,
  },
  {
    id: 6,
    category: 'cultural',
    author: 'Fine Arts Club',
    avatar: '🎨',
    time: '3d ago',
    title: 'Photography Exhibition – Frames of Life',
    description: 'Submit your best shots for our annual photography exhibition. Theme: "Campus Life". Last date: July 20.',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80',
    tags: ['#Photography', '#FineArts'],
    likes: 76,
    comments: 14,
  },
  {
    id: 7,
    category: 'placement',
    author: 'Training & Placement Cell',
    avatar: '💼',
    time: '3d ago',
    title: 'Resume Building Workshop',
    description: 'Learn how to craft an ATS-friendly resume. Industry experts will review your resumes live. July 21, 2 PM, Room 301.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80',
    tags: ['#Resume', '#PlacementPrep'],
    likes: 134,
    comments: 29,
  },
  {
    id: 8,
    category: 'clubs',
    author: 'Robotics Club',
    avatar: '🤖',
    time: '4d ago',
    title: 'Line Follower Robot Competition',
    description: 'Build a line-following robot and compete! Open to all years. Components provided. Register by July 18.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
    tags: ['#Robotics', '#Competition'],
    likes: 88,
    comments: 17,
  },
];

export default function EventsFeed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [liked, setLiked] = useState({});

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = activeFilter === 'all' ? POSTS : POSTS.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5ede0' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#5c3317' }} className="text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <span className="text-xl font-bold tracking-wide">🎓 CampusHub</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium hover:underline"
            style={{ color: '#e8c9a0' }}
          >
            Dashboard
          </button>
          <span className="text-sm" style={{ color: '#e8c9a0' }}>
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold px-4 py-1.5 rounded-full transition"
            style={{ backgroundColor: '#e8c9a0', color: '#5c3317' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold" style={{ color: '#5c3317' }}>Campus Feed</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8b5e3c' }}>Stay updated with everything happening on campus</p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                activeFilter === f.key
                  ? { backgroundColor: '#5c3317', color: '#fff' }
                  : { backgroundColor: '#e8c9a0', color: '#5c3317' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl overflow-hidden shadow-sm"
              style={{ backgroundColor: '#fff8f0', border: '1px solid #e8c9a0' }}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: '#f5ede0' }}
                >
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#5c3317' }}>{post.author}</p>
                  <p className="text-xs" style={{ color: '#a07850' }}>{post.time}</p>
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
                  style={{ backgroundColor: '#f5ede0', color: '#8b5e3c' }}
                >
                  {FILTERS.find((f) => f.key === post.category)?.label}
                </span>
              </div>

              {/* Post Image */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full object-cover"
                style={{ maxHeight: '280px' }}
              />

              {/* Post Body */}
              <div className="px-4 py-3">
                <p className="font-bold text-base mb-1" style={{ color: '#5c3317' }}>{post.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6b4226' }}>{post.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium" style={{ color: '#a07850' }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Post Actions */}
              <div
                className="flex items-center gap-5 px-4 py-3 border-t"
                style={{ borderColor: '#e8c9a0' }}
              >
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 text-sm font-medium transition"
                  style={{ color: liked[post.id] ? '#c0392b' : '#8b5e3c' }}
                >
                  {liked[post.id] ? '❤️' : '🤍'}
                  <span>{post.likes + (liked[post.id] ? 1 : 0)}</span>
                </button>
                <button
                  className="flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: '#8b5e3c' }}
                  onClick={() => toast('Comments coming soon!', { icon: '💬' })}
                >
                  💬 <span>{post.comments}</span>
                </button>
                <button
                  className="flex items-center gap-1.5 text-sm font-medium ml-auto"
                  style={{ color: '#8b5e3c' }}
                  onClick={() => toast('Shared!', { icon: '🔗' })}
                >
                  🔗 Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: '#a07850' }}>
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold">No posts in this category yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
