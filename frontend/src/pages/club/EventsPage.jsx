import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, CircularProgress, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import api from '../../api';
import EventCard from '../../components/EventCard';
import FilterBar from '../../components/FilterBar';

const EMPTY = { title: '', description: '', date: '', time: '', venue: '', club: '' };
const SX = { mt: 2, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } };
const FILTERS = ['all', 'upcoming', 'past'];

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = async () => {
    try {
      const [ev, cl] = await Promise.all([api.get('/club/events'), api.get('/club/clubs')]);
      setEvents(ev.data.data);
      setClubs(cl.data.data);
    } catch { toast.error('Failed to load data'); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    let list = events.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      (e.venue || '').toLowerCase().includes(q) ||
      (e.description || '').toLowerCase().includes(q)
    );
    if (filter === 'upcoming') list = list.filter((e) => new Date(e.date) >= new Date());
    if (filter === 'past') list = list.filter((e) => new Date(e.date) < new Date());
    setFiltered(list);
  }, [search, filter, events]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (e) => {
    setForm({
      title: e.title, description: e.description || '',
      date: e.date ? e.date.split('T')[0] : '',
      time: e.time || '', venue: e.venue || '',
      club: e.club?._id || '',
    });
    setEditId(e._id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, club: form.club || null };
      if (editId) {
        await api.put(`/club/events/${editId}`, payload);
        toast.success('Event updated');
      } else {
        await api.post('/club/events', payload);
        toast.success('Event created');
      }
      setOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving event');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/club/events/${deleteId}`);
      toast.success('Event deleted');
      setDeleteId(null);
      fetchAll();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="bg-gray-50 min-h-full p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <CalendarMonthIcon sx={{ fontSize: 18, color: '#4F46E5' }} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Events</h1>
          </div>
          <p className="text-sm text-gray-500 ml-10">{events.length} event{events.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' }, borderRadius: '10px', fontWeight: 600, px: 3, textTransform: 'none' }}
        >
          Create Event
        </Button>
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        filters={FILTERS}
        active={filter}
        onFilter={setFilter}
        placeholder="Search events..."
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
          <p className="text-base font-semibold text-gray-700 mb-1">No events yet</p>
          <p className="text-sm text-gray-400 mb-5">Create your first event to get started</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' }, borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
          >
            Create Event
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((e) => (
            <EventCard
              key={e._id}
              event={e}
              isClubRole={true}
              onView={(ev) => navigate(`/club/events/${ev._id}/registrations`)}
              onEdit={openEdit}
              onDelete={setDeleteId}
              onViewDetails={(ev) => navigate(`/club/events/${ev._id}/details`)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', pb: 1, color: '#111827' }}>
          {editId ? 'Edit Event' : 'Create New Event'}
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#9CA3AF' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 0 }}>
            <TextField label="Event Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth size="small" sx={SX} />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth size="small" multiline rows={2} sx={SX} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Date *" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required fullWidth size="small" InputLabelProps={{ shrink: true }} sx={SX} />
              <TextField label="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} fullWidth size="small" placeholder="e.g. 3:00 PM" sx={SX} />
            </div>
            <TextField label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} fullWidth size="small" sx={SX} />
            {clubs.length > 0 && (
              <TextField select label="Link to Club (optional)" value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} fullWidth size="small" sx={SX}>
                <MenuItem value="">None</MenuItem>
                {clubs.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' }, borderRadius: '10px', fontWeight: 600, px: 3, textTransform: 'none' }}>
              {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : editId ? 'Save Changes' : 'Create Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>Delete Event?</DialogTitle>
        <DialogContent><p className="text-sm text-gray-500">This action cannot be undone.</p></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: '10px', color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
