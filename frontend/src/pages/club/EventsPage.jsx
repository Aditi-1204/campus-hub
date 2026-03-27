import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, CircularProgress, Tooltip, Chip, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import api from '../../api';

const EMPTY = { title: '', description: '', date: '', time: '', venue: '', club: '' };

const sx = { mt: 2, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } };

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
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

  const openView = (e) => navigate(`/club/events/${e._id}/registrations`);

  const isUpcoming = (date) => new Date(date) >= new Date();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <EventIcon sx={{ color: '#2563eb' }} /> Events
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''} created</p>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, borderRadius: '10px', fontWeight: 700, px: 3 }}>
          Create Event
        </Button>
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><CircularProgress sx={{ color: '#2563eb' }} /></div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <EventIcon sx={{ fontSize: 36 }} />
          </div>
          <p className="font-semibold text-slate-700 mb-1">No events yet</p>
          <p className="text-sm text-slate-400 mb-4">Create your first event to get started</p>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
            sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, borderRadius: '10px', fontWeight: 700 }}>
            Create Event
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((e) => {
            const upcoming = isUpcoming(e.date);
            const day = new Date(e.date).getDate();
            const month = new Date(e.date).toLocaleString('default', { month: 'short' });
            const year = new Date(e.date).getFullYear();
            return (
              <div key={e._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
                {/* Banner */}
                <div className={`h-24 flex flex-col items-center justify-center relative ${upcoming ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-slate-400 to-slate-600'}`}>
                  <span className="text-3xl font-extrabold text-white leading-none">{day}</span>
                  <span className="text-blue-200 text-sm font-semibold">{month} {year}</span>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${upcoming ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-200'}`}>
                      {upcoming ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                </div>
                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">{e.title}</h3>
                  {e.club && (
                    <Chip label={e.club.name} size="small" sx={{ mb: 1, alignSelf: 'flex-start', bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.6rem' }} />
                  )}
                  <p className="text-xs text-slate-400 leading-relaxed flex-1 line-clamp-2 mb-2">
                    {e.description || 'No description provided.'}
                  </p>
                  <div className="space-y-1 mb-3">
                    {e.time && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <AccessTimeIcon sx={{ fontSize: 13 }} /> {e.time}
                      </div>
                    )}
                    {e.venue && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <LocationOnIcon sx={{ fontSize: 13 }} />
                        <span className="truncate">{e.venue}</span>
                      </div>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                    <button onClick={() => openView(e)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-1.5 rounded-lg transition-colors">
                      <VisibilityIcon sx={{ fontSize: 14 }} /> View
                    </button>
                    <button onClick={() => openEdit(e)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 py-1.5 rounded-lg transition-colors">
                      <EditIcon sx={{ fontSize: 14 }} /> Edit
                    </button>
                    <button onClick={() => setDeleteId(e._id)}
                      className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg transition-colors">
                      <DeleteIcon sx={{ fontSize: 14 }} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
          {editId ? 'Edit Event' : 'Create New Event'}
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#94a3b8' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 0 }}>
            <TextField label="Event Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              required fullWidth size="small" sx={sx} />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth size="small" multiline rows={2} sx={sx} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Date *" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                required fullWidth size="small" InputLabelProps={{ shrink: true }} sx={sx} />
              <TextField label="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                fullWidth size="small" placeholder="e.g. 3:00 PM" sx={sx} />
            </div>
            <TextField label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
              fullWidth size="small" sx={sx} />
            {clubs.length > 0 && (
              <TextField select label="Link to Club (optional)" value={form.club}
                onChange={(e) => setForm({ ...form, club: e.target.value })}
                fullWidth size="small" sx={sx}>
                <MenuItem value="">None</MenuItem>
                {clubs.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', color: '#64748b' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}
              sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, borderRadius: '10px', fontWeight: 700, px: 3 }}>
              {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : editId ? 'Save Changes' : 'Create Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Event?</DialogTitle>
        <DialogContent>
          <p className="text-slate-500 text-sm">This action cannot be undone.</p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: '10px', color: '#64748b' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained"
            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, borderRadius: '10px', fontWeight: 700 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
