import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, CircularProgress, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';

const EMPTY = { name: '', email: '', password: '' };

export default function ManageClubs() {
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
      const { data } = await api.get('/admin/clubs');
      setClubs(data.data);
      setFiltered(data.data);
    } catch {
      toast.error('Failed to load clubs');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchClubs(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(clubs.filter((c) =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    ));
  }, [search, clubs]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (c) => {
    setForm({ name: c.name, email: c.email, password: '' });
    setEditId(c._id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (editId && !payload.password) delete payload.password;
      if (editId) {
        await api.put(`/admin/clubs/${editId}`, payload);
        toast.success('Club updated');
      } else {
        await api.post('/admin/clubs', payload);
        toast.success('Club added');
      }
      setOpen(false);
      fetchClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving club');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/clubs/${deleteId}`);
      toast.success('Club deleted');
      setDeleteId(null);
      fetchClubs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <GroupsIcon sx={{ color: '#7c3aed' }} /> Manage Clubs
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{clubs.length} clubs registered</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, borderRadius: '10px', fontWeight: 700, px: 3 }}
        >
          Add Club
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 20 }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <CircularProgress sx={{ color: '#7c3aed' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <GroupsIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
            <p className="font-medium">{search ? 'No results found' : 'No clubs yet'}</p>
            {!search && <p className="text-sm mt-1">Click "Add Club" to get started</p>}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Club Name', 'Email', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                        {c.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{c.email}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: '#7c3aed', '&:hover': { bgcolor: '#f5f3ff' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleteId(c._id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
          {editId ? 'Edit Club' : 'Add New Club'}
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#94a3b8' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <div className="space-y-4">
              <TextField
                label="Club Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                required fullWidth size="small" sx={{ mt: 2, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <TextField
                label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                required fullWidth size="small" sx={{ mt: 2, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <TextField
                label={editId ? 'New Password (leave blank to keep)' : 'Password'}
                type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editId} fullWidth size="small" sx={{ mt: 2, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', color: '#64748b' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}
              sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, borderRadius: '10px', fontWeight: 700, px: 3 }}>
              {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : editId ? 'Save Changes' : 'Add Club'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Club?</DialogTitle>
        <DialogContent>
          <p className="text-slate-500 text-sm">This action cannot be undone. The club will be permanently removed.</p>
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
