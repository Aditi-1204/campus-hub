import { CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=300&fit=crop',
];

function getIndex(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export default function EventCard({
  event,
  isClubRole = false,
  bookmarked = false,
  onBookmark,
  onRegister,
  onEdit,
  onDelete,
  onView,
  onViewDetails,
  loadingId,
}) {
  const e = event;
  const upcoming = new Date(e.date) >= new Date();
  const imgSrc = e.image || EVENT_IMAGES[getIndex(e.title) % EVENT_IMAGES.length];
  const capacity = e.capacity || 100;
  const filled = Math.min(100, Math.round(((e.registrationCount || 0) / capacity) * 100));
  const dateStr = new Date(e.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col overflow-hidden">

      {/* ── Cover Image ── */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={e.title}
          className="w-full h-full object-cover"
          onError={(ev) => {
            ev.target.style.display = 'none';
            ev.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 hidden items-center justify-center">
          <span className="text-4xl font-bold text-white">{new Date(e.date).getDate()}</span>
        </div>
        {/* subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Club tag — top left */}
        {e.club && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 shadow-sm">
            {e.club.name}
          </span>
        )}

        {/* Bookmark — top right */}
        {onBookmark && (
          <button
            onClick={() => onBookmark(e._id)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
          >
            {bookmarked
              ? <BookmarkIcon sx={{ fontSize: 16, color: '#4F46E5' }} />
              : <BookmarkBorderIcon sx={{ fontSize: 16, color: '#6B7280' }} />}
          </button>
        )}

        {/* Status badge — bottom left */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            upcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {upcoming ? 'Upcoming' : 'Past'}
          </span>
          {e.isRegistered && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              ✓ RSVP'd
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">{e.title}</h3>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {e.description || 'No description provided.'}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AccessTimeIcon sx={{ fontSize: 13, color: '#4F46E5' }} />
            <span>{dateStr}{e.time ? ` · ${e.time}` : ''}</span>
          </div>
          {e.venue && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <LocationOnIcon sx={{ fontSize: 13, color: '#4F46E5' }} />
              <span className="truncate">{e.venue}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <PeopleIcon sx={{ fontSize: 13, color: '#4F46E5' }} />
            <span>{e.registrationCount || 0} going</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Seats filled</span>
            <span className={`font-semibold ${
              filled >= 90 ? 'text-red-500' : filled >= 60 ? 'text-yellow-500' : 'text-green-600'
            }`}>{filled}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                filled >= 90 ? 'bg-red-500' : filled >= 60 ? 'bg-yellow-400' : 'bg-green-500'
              }`}
              style={{ width: `${filled}%` }}
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col gap-2 mt-auto">

          {/* View Details — everyone */}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(e)}
              className="w-full py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
            >
              View Details <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </button>
          )}

          {/* Club-role row */}
          {isClubRole && (
            <div className="flex gap-2">
              {onView && (
                <button onClick={() => onView(e)} className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 rounded-xl transition-colors">
                  <VisibilityIcon sx={{ fontSize: 13 }} /> Registrations
                </button>
              )}
              <button onClick={() => onEdit(e)} className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl transition-colors">
                <EditIcon sx={{ fontSize: 13 }} /> Edit
              </button>
              <button onClick={() => onDelete(e._id)} className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 py-2 rounded-xl transition-colors">
                <DeleteIcon sx={{ fontSize: 13 }} /> Delete
              </button>
            </div>
          )}

          {/* Student RSVP */}
          {!isClubRole && (
            <button
              disabled={loadingId === e._id || !upcoming}
              onClick={() => onRegister(e)}
              className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                !upcoming
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : e.isRegistered
                  ? 'border border-red-400 text-red-500 hover:bg-red-50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {loadingId === e._id
                ? <CircularProgress size={13} sx={{ color: 'inherit' }} />
                : !upcoming ? 'Event Ended'
                : e.isRegistered ? 'Unregister'
                : 'RSVP / Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
