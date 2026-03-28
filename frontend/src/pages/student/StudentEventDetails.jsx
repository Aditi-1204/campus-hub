import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import api from '../../api';

const BOOKMARK_KEY = 'bookmarked_events';
function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; } catch { return []; }
}

const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=400&fit=crop',
];
function getIndex(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export default function StudentEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get('/student/events');
      const found = data.data.find((e) => e._id === id);
      if (!found) { toast.error('Event not found'); navigate('/student/events'); return; }
      setEvent(found);
    } catch { toast.error('Failed to load event'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvent(); }, [id]);

  const handleRegister = async () => {
    setActionLoading(true);
    try {
      if (event.isRegistered) {
        await api.delete(`/student/events/${id}/unregister`);
        toast.success('Unregistered from event');
      } else {
        await api.post(`/student/events/${id}/register`);
        toast.success('Registered successfully!');
      }
      fetchEvent();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setActionLoading(false); }
  };

  const toggleBookmark = () => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
    toast.success(bookmarks.includes(id) ? 'Bookmark removed' : 'Event bookmarked!');
  };

  if (loading) return (
    <div className="flex justify-center py-24"><CircularProgress sx={{ color: '#4F46E5' }} /></div>
  );
  if (!event) return null;

  const upcoming = new Date(event.date) >= new Date();
  const capacity = event.capacity || 100;
  const filled = Math.min(100, Math.round(((event.registrationCount || 0) / capacity) * 100));
  const imgSrc = EVENT_IMAGES[getIndex(event.title) % EVENT_IMAGES.length];
  const dateStr = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const bookmarked = bookmarks.includes(id);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/student/events')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors font-medium"
      >
        <ArrowBackIcon fontSize="small" /> Back to Events
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        {/* Banner */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img src={imgSrc} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

          {/* Club tag */}
          {event.club && (
            <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 shadow-sm">
              {event.club.name}
            </span>
          )}

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
          >
            {bookmarked
              ? <BookmarkIcon sx={{ fontSize: 19, color: '#4F46E5' }} />
              : <BookmarkBorderIcon sx={{ fontSize: 19, color: '#6B7280' }} />}
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${
              upcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {upcoming ? 'Upcoming' : 'Past Event'}
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold text-white leading-tight drop-shadow">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <CalendarTodayIcon sx={{ fontSize: 15, color: '#4F46E5' }} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Date</p>
                <p className="text-sm font-semibold text-gray-800">{dateStr}</p>
              </div>
            </div>
            {event.time && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <AccessTimeIcon sx={{ fontSize: 15, color: '#4F46E5' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Time</p>
                  <p className="text-sm font-semibold text-gray-800">{event.time}</p>
                </div>
              </div>
            )}
            {event.venue && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <LocationOnIcon sx={{ fontSize: 15, color: '#4F46E5' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Venue</p>
                  <p className="text-sm font-semibold text-gray-800">{event.venue}</p>
                </div>
              </div>
            )}
          </div>

          {/* Attendees + Progress */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PeopleIcon sx={{ fontSize: 16, color: '#4F46E5' }} />
                <span className="font-semibold">{event.registrationCount || 0} / {capacity} attending</span>
              </div>
              <span className={`text-sm font-semibold ${
                filled >= 90 ? 'text-red-500' : filled >= 60 ? 'text-yellow-500' : 'text-green-600'
              }`}>
                {filled}% filled
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  filled >= 90 ? 'bg-red-500' : filled >= 60 ? 'bg-yellow-400' : 'bg-green-500'
                }`}
                style={{ width: `${filled}%` }}
              />
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">About this Event</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* RSVP Button */}
          <button
            disabled={actionLoading || !upcoming}
            onClick={handleRegister}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
              !upcoming
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : event.isRegistered
                ? 'border-2 border-red-400 text-red-500 hover:bg-red-50'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
            }`}
          >
            {actionLoading
              ? <CircularProgress size={16} sx={{ color: 'inherit' }} />
              : !upcoming ? 'Event has ended'
              : event.isRegistered ? '✓ Registered — Click to Unregister'
              : 'RSVP / Register for this Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
