import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import api from '../../api';

const CLUB_IMAGES = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&h=400&fit=crop',
];
const GRADIENTS = [
  'from-indigo-500 to-indigo-700', 'from-purple-500 to-purple-700',
  'from-blue-500 to-blue-700', 'from-teal-500 to-teal-700',
  'from-violet-500 to-violet-700', 'from-sky-500 to-sky-700',
];
const BADGE_STYLES = [
  'bg-indigo-100 text-indigo-700', 'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700', 'bg-teal-100 text-teal-700',
  'bg-violet-100 text-violet-700', 'bg-sky-100 text-sky-700',
];
const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700', 'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700', 'bg-teal-100 text-teal-700',
  'bg-violet-100 text-violet-700',
];

function getIndex(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export default function StudentClubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [clubsRes, eventsRes] = await Promise.all([
        api.get('/student/clubs'),
        api.get('/student/events'),
      ]);
      const found = clubsRes.data.data.find((c) => c._id === id);
      if (!found) { toast.error('Club not found'); navigate('/student/clubs'); return; }
      setClub(found);
      setEvents(eventsRes.data.data.filter((e) => e.club?._id === id));
    } catch { toast.error('Failed to load club'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      if (club.isJoined) {
        await api.delete(`/student/clubs/${id}/leave`);
        toast.success(`Left ${club.name}`);
      } else {
        await api.post(`/student/clubs/${id}/join`);
        toast.success(`Joined ${club.name}!`);
      }
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setActionLoading(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-24"><CircularProgress sx={{ color: '#4F46E5' }} /></div>
  );
  if (!club) return null;

  const idx = getIndex(club.name);
  const imgSrc = CLUB_IMAGES[idx % CLUB_IMAGES.length];
  const gradient = GRADIENTS[idx % GRADIENTS.length];
  const badgeStyle = BADGE_STYLES[idx % BADGE_STYLES.length];
  const memberCount = club.memberCount || 0;
  const avatarLetters = Array.from({ length: Math.min(memberCount, 8) }, (_, i) =>
    String.fromCharCode(65 + ((idx + i) % 26))
  );

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/student/clubs')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors font-medium"
      >
        <ArrowBackIcon fontSize="small" /> Back to Clubs
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        {/* Banner */}
        <div className="relative h-52 sm:h-64 overflow-hidden">
          <img src={imgSrc} alt={club.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

          <div className={`absolute top-4 left-4 w-13 h-13 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl font-bold text-white shadow-md`}>
            {club.name[0].toUpperCase()}
          </div>

          {club.isJoined && (
            <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 shadow-sm">
              ✓ Joined
            </span>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            {club.category && (
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${badgeStyle}`}>
                {club.category}
              </span>
            )}
            <h1 className="text-xl sm:text-2xl font-semibold text-white drop-shadow">{club.name}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <PeopleIcon sx={{ fontSize: 15, color: '#4F46E5' }} />
              <span className="text-sm font-semibold text-gray-700">{memberCount} Members</span>
            </div>
            {club.venue && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <LocationOnIcon sx={{ fontSize: 15, color: '#4F46E5' }} />
                <span className="text-sm font-semibold text-gray-700">{club.venue}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {club.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">About</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{club.description}</p>
            </div>
          )}

          {/* Member avatars */}
          {memberCount > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Members <span className="text-gray-400 font-normal">({memberCount})</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {avatarLetters.map((letter, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                  >
                    {letter}
                  </div>
                ))}
                {memberCount > 8 && (
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                    +{memberCount - 8}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Club Events */}
          {events.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Events <span className="text-gray-400 font-normal">({events.length})</span>
              </h2>
              <div className="space-y-2">
                {events.map((ev) => {
                  const upcoming = new Date(ev.date) >= new Date();
                  return (
                    <div key={ev._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${upcoming ? 'bg-indigo-100' : 'bg-gray-200'}`}>
                        <EventIcon sx={{ fontSize: 16, color: upcoming ? '#4F46E5' : '#9CA3AF' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{ev.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <AccessTimeIcon sx={{ fontSize: 11 }} />
                            {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {ev.venue && (
                            <span className="flex items-center gap-1 truncate">
                              <LocationOnIcon sx={{ fontSize: 11 }} />{ev.venue}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        upcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {upcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Join / Leave */}
          <button
            disabled={actionLoading}
            onClick={handleJoin}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
              club.isJoined
                ? 'border-2 border-red-400 text-red-500 hover:bg-red-50'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
            }`}
          >
            {actionLoading
              ? <CircularProgress size={16} sx={{ color: 'inherit' }} />
              : club.isJoined ? 'Leave this Club' : 'Join this Club'}
          </button>
        </div>
      </div>
    </div>
  );
}
