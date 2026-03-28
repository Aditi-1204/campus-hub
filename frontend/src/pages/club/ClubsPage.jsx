import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import api from '../../api';
import ClubCard from '../../components/ClubCard';
import FilterBar from '../../components/FilterBar';

const EMPTY = { name: '', description: '', category: '', venue: '' };
const SX = { mt: 2, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } };

export default function ClubsPage() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
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

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(clubs.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    ));
  }, [search, clubs]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (c) => {
    setForm({ name: c.name, description: c.description || '', category: c.category || '', venue: c.venue || '' });
    setEditId(c._id);
    setOpen(true);
  };

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

  return (
    <div className="bg-gray-50 min-h-full p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <GroupsIcon sx={{ fontSize: 18, color: '#4F46E5' }} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Clubs</h1>
          </div>
          <p className="text-sm text-gray-500 ml-10">{clubs.length} club{clubs.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' }, borderRadius: '10px', fontWeight: 600, px: 3, textTransform: 'none' }}
        >
          Create Club
        </Button>
      </div>

      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search clubs by name or category..."
      />

      {fetching ? (
        <div className="flex justify-center py-20">
          <CircularProgress sx={{ color: '#4F46E5' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <GroupsIcon sx={{ fontSize: 28, color: '#4F46E5' }} />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">No clubs yet</p>
          <p className="text-sm text-gray-400 mb-5">Create your first club to get started</p>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' }, borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
          >
            Create Club
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <ClubCard
              key={c._id}
              club={c}
              isClubRole={true}
              onView={(club) => navigate(`/club/clubs/${club._id}/members`)}
              onEdit={openEdit}
              onDelete={setDeleteId}
              onViewDetails={(club) => navigate(`/club/clubs/${club._id}/details`)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', pb: 1, color: '#111827' }}>
          {editId ? 'Edit Club' : 'Create New Club'}
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#9CA3AF' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 0 }}>
            <TextField label="Club Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth size="small" sx={SX} />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth size="small" multiline rows={3} sx={SX} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth size="small" placeholder="e.g. Technical" sx={{ mt: 1, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
              <TextField label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} fullWidth size="small" placeholder="e.g. Lab Block 2" sx={{ mt: 1, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' }, borderRadius: '10px', fontWeight: 600, px: 3, textTransform: 'none' }}>
              {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : editId ? 'Save Changes' : 'Create Club'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>Delete Club?</DialogTitle>
        <DialogContent><p className="text-sm text-gray-500">This will also delete all events linked to this club.</p></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: '10px', color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
