import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, CircularProgress, Tooltip, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from '../../api';

const EMPTY = { name: '', description: '', category: '', venue: '' };

export default function ClubsPage() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchClubs = async () => {
    try {
      const { data } = await api.get('/club/clubs');
      setClubs(data.data);
    } catch { toast.error('Failed to load clubs'); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchClubs(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '', category: c.category || '', venue: c.venue || '' }); setEditId(c._id); setOpen(true); };

  const openView = (c) => navigate(`/club/clubs/${c._id}/members`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/club/clubs/${editId}`, form);
        toast.success('Club updated');
      } else {
        await api.post('/club/clubs', form);
        toast.success('Club created');
      }
      setOpen(false);
      fetchClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving club');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/club/clubs/${deleteId}`);
      toast.success('Club deleted');
      setDeleteId(null);
      fetchClubs();
    } catch { toast.error('Failed to delete'); }
  };

  const f = (label, key, multiline = false) => (
    <TextField key={key} label={label} value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      fullWidth size="small" multiline={multiline} rows={multiline ? 3 : 1}
      sx={{ mt: 2, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
    />
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <GroupsIcon sx={{ color: '#7c3aed' }} /> Clubs
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{clubs.length} club{clubs.length !== 1 ? 's' : ''} created</p>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, borderRadius: '10px', fontWeight: 700, px: 3 }}>
          Create Club
        </Button>
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><CircularProgress sx={{ color: '#7c3aed' }} /></div>
      ) : clubs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <GroupsIcon sx={{ fontSize: 36 }} />
          </div>
          <p className="font-semibold text-slate-700 mb-1">No clubs yet</p>
          <p className="text-sm text-slate-400 mb-4">Create your first club to get started</p>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
            sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, borderRadius: '10px', fontWeight: 700 }}>
            Create Club
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {clubs.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center relative">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-extrabold text-white border-2 border-white/30">
                  {c.name[0].toUpperCase()}
                </div>
              </div>
              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">{c.name}</h3>
                {c.category && (
                  <Chip label={c.category} size="small" sx={{ mb: 1, alignSelf: 'flex-start', bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.6rem' }} />
                )}
                <p className="text-xs text-slate-400 leading-relaxed flex-1 line-clamp-2 mb-3">
                  {c.description || 'No description provided.'}
                </p>
                {c.venue && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                    <LocationOnIcon sx={{ fontSize: 13 }} />
                    <span className="truncate">{c.venue}</span>
                  </div>
                )}
                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                  <button onClick={() => openView(c)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-1.5 rounded-lg transition-colors">
                    <VisibilityIcon sx={{ fontSize: 14 }} /> View
                  </button>
                  <button onClick={() => openEdit(c)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 py-1.5 rounded-lg transition-colors">
                    <EditIcon sx={{ fontSize: 14 }} /> Edit
                  </button>
                  <button onClick={() => setDeleteId(c._id)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg transition-colors">
                    <DeleteIcon sx={{ fontSize: 14 }} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
          {editId ? 'Edit Club' : 'Create New Club'}
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#94a3b8' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 0 }}>
            <TextField label="Club Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              required fullWidth size="small" sx={{ mt: 2, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            {f('Description', 'description', true)}
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                fullWidth size="small" placeholder="e.g. Technical"
                sx={{ mt: 1, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
              <TextField label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
                fullWidth size="small" placeholder="e.g. Lab Block 2"
                sx={{ mt: 1, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', color: '#64748b' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}
              sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, borderRadius: '10px', fontWeight: 700, px: 3 }}>
              {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : editId ? 'Save Changes' : 'Create Club'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Club?</DialogTitle>
        <DialogContent>
          <p className="text-slate-500 text-sm">This will also delete all events linked to this club.</p>
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
