import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import api from '../../api';
import EventCard from '../../components/EventCard';
import FilterBar from '../../components/FilterBar';

const BOOKMARK_KEY = 'bookmarked_events';
const FILTERS = ['all', 'upcoming', 'past', 'registered', 'bookmarked'];

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; } catch { return []; }
}

export default function StudentEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [fetching, setFetching] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/student/events');
      setEvents(data.data);
    } catch { toast.error('Failed to load events'); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    let list = events.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      (e.venue || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q)
    );
    if (filter === 'upcoming') list = list.filter((e) => new Date(e.date) >= new Date());
    if (filter === 'past') list = list.filter((e) => new Date(e.date) < new Date());
    if (filter === 'registered') list = list.filter((e) => e.isRegistered);
    if (filter === 'bookmarked') list = list.filter((e) => bookmarks.includes(e._id));
    setFiltered(list);
  }, [search, filter, events, bookmarks]);

  const handleRegister = async (event) => {
    setLoadingId(event._id);
    try {
      if (event.isRegistered) {
        await api.delete(`/student/events/${event._id}/unregister`);
        toast.success('Unregistered from event');
      } else {
        await api.post(`/student/events/${event._id}/register`);
        toast.success('Registered successfully!');
      }
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setLoadingId(null); }
  };

  const toggleBookmark = (id) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
    toast.success(bookmarks.includes(id) ? 'Bookmark removed' : 'Event bookmarked!');
  };

  return (
    <div className="bg-gray-50 min-h-full p-1">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <CalendarMonthIcon sx={{ fontSize: 18, color: '#4F46E5' }} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Events</h1>
        </div>
        <p className="text-sm text-gray-500 ml-10">Browse and register for campus events</p>
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        filters={FILTERS}
        active={filter}
        onFilter={setFilter}
        placeholder="Search events by title, venue..."
      />

      {fetching ? (
        <div className="flex justify-center py-20">
          <CircularProgress sx={{ color: '#4F46E5' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <CalendarMonthIcon sx={{ fontSize: 28, color: '#4F46E5' }} />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">No events found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((e) => (
            <EventCard
              key={e._id}
              event={e}
              isClubRole={false}
              bookmarked={bookmarks.includes(e._id)}
              onBookmark={toggleBookmark}
              onRegister={handleRegister}
              onViewDetails={(ev) => navigate(`/student/events/${ev._id}`)}
              loadingId={loadingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
