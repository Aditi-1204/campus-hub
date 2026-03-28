import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, IconButton, MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';

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
const SX = { mt: 2, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } };

export default function ClubEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [evRes, clRes] = await Promise.all([api.get('/club/events'), api.get('/club/clubs')]);
      const found = evRes.data.data.find((e) => e._id === id);
      if (!found) { toast.error('Event not found'); navigate('/club/events'); return; }
      setEvent(found);
      setClubs(clRes.data.data);
    } catch { toast.error('Failed to load event'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const openEdit = () => {
    setForm({
      title: event.title, description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '',
      time: event.time || '', venue: event.venue || '',
      club: event.club?._id || '',
    });
    setEditOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/club/events/${id}`, { ...form, club: form.club || null });
      toast.success('Event updated');
      setEditOpen(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/club/events/${id}`);
      toast.success('Event deleted');
      navigate('/club/events');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex justify-center py-24"><CircularProgress sx={{ color: '#4F46E5' }} /></div>;
  if (!event) return null;

  const upcoming = new Date(event.date) >= new Date();
  const registrationCount = event.registrations?.length ?? event.registrationCount ?? 0;
  const capacity = event.capacity || 100;
  const filled = Math.min(100, Math.round((registrationCount / capacity) * 100));
  const imgSrc = EVENT_IMAGES[getIndex(event.title) % EVENT_IMAGES.length];
  const dateStr = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/club/events')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors font-medium">
        <ArrowBackIcon fontSize="small" /> Back to Events
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        {/* Banner */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img src={imgSrc} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          {event.club && (
            <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 shadow-sm">
              {event.club.name}
            </span>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${
              upcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {upcoming ? 'Upcoming' : 'Past Event'}
            </span>
            <h1 className="text-xl sm:text-2xl font-semibold text-white drop-shadow">{event.title}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Action bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => navigate(`/club/events/${id}/registrations`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              <VisibilityIcon sx={{ fontSize: 15 }} /> View Registrations
            </button>
            <button onClick={openEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <EditIcon sx={{ fontSize: 15 }} /> Edit
            </button>
            <button onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
              <DeleteIcon sx={{ fontSize: 15 }} /> Delete
            </button>
          </div>

          {/* Meta */}
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
                <span className="font-semibold">{registrationCount} / {capacity} registered</span>
              </div>
              <span className={`text-sm font-semibold ${
                filled >= 90 ? 'text-red-500' : filled >= 60 ? 'text-yellow-500' : 'text-green-600'
              }`}>{filled}% filled</span>
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

          {event.description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">About this Event</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', pb: 1, color: '#111827' }}>
          Edit Event
          <IconButton onClick={() => setEditOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#9CA3AF' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent sx={{ pt: 0 }}>
            <TextField label="Event Title *" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth size="small" sx={SX} />
            <TextField label="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth size="small" multiline rows={2} sx={SX} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Date *" type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} required fullWidth size="small" InputLabelProps={{ shrink: true }} sx={SX} />
              <TextField label="Time" value={form.time || ''} onChange={(e) => setForm({ ...form, time: e.target.value })} fullWidth size="small" placeholder="e.g. 3:00 PM" sx={SX} />
            </div>
            <TextField label="Venue" value={form.venue || ''} onChange={(e) => setForm({ ...form, venue: e.target.value })} fullWidth size="small" sx={SX} />
            {clubs.length > 0 && (
              <TextField select label="Link to Club (optional)" value={form.club || ''} onChange={(e) => setForm({ ...form, club: e.target.value })} fullWidth size="small" sx={SX}>
                <MenuItem value="">None</MenuItem>
                {clubs.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setEditOpen(false)} sx={{ borderRadius: '10px', color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' }, borderRadius: '10px', fontWeight: 600, px: 3, textTransform: 'none' }}>
              {saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>Delete Event?</DialogTitle>
        <DialogContent><p className="text-sm text-gray-500">This action cannot be undone.</p></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ borderRadius: '10px', color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
