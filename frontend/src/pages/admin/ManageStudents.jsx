import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Chip, CircularProgress, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';

const EMPTY = { name: '', email: '', password: '', rollNumber: '', department: '', year: '' };

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/admin/students');
      setStudents(data.data);
      setFiltered(data.data);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(students.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.rollNumber || '').toLowerCase().includes(q) ||
      (s.department || '').toLowerCase().includes(q)
    ));
  }, [search, students]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (s) => {
    setForm({ name: s.name, email: s.email, password: '', rollNumber: s.rollNumber || '', department: s.department || '', year: s.year || '' });
    setEditId(s._id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (editId && !payload.password) delete payload.password;
      if (editId) {
        await api.put(`/admin/students/${editId}`, payload);
        toast.success('Student updated');
      } else {
        await api.post('/admin/students', payload);
        toast.success('Student added');
      }
      setOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/students/${deleteId}`);
      toast.success('Student deleted');
      setDeleteId(null);
      fetchStudents();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const field = (label, key, type = 'text', required = false) => (
    <TextField
      key={key}
      label={label}
      type={type}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      required={required}
      fullWidth
      size="small"
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
    />
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <SchoolIcon sx={{ color: '#2563eb' }} /> Manage Students
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{students.length} students registered</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{
            bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' },
            borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3,
          }}
        >
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 20 }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, roll number or department..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <CircularProgress sx={{ color: '#4f46e5' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <SchoolIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
            <p className="font-medium">{search ? 'No results found' : 'No students yet'}</p>
            {!search && <p className="text-sm mt-1">Click "Add Student" to get started</p>}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Name', 'Email', 'Roll No', 'Department', 'Year', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                        {s.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{s.email}</td>
                  <td className="px-5 py-4">
                    {s.rollNumber ? <Chip label={s.rollNumber} size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600, fontSize: '0.7rem' }} /> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{s.department || <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-4 text-slate-600">{s.year ? `Year ${s.year}` : <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(s)} sx={{ color: '#4f46e5', '&:hover': { bgcolor: '#eef2ff' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleteId(s._id)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}>
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
          {editId ? 'Edit Student' : 'Add New Student'}
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#94a3b8' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <div className="space-y-4">
              {field('Full Name', 'name', 'text', true)}
              {field('Email Address', 'email', 'email', true)}
              <TextField
                label={editId ? 'New Password (leave blank to keep)' : 'Password'}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editId}
                fullWidth
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
              <div className="grid grid-cols-2 gap-3">
                {field('Roll Number', 'rollNumber')}
                {field('Department', 'department')}
              </div>
              {field('Year', 'year', 'number')}
            </div>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', textTransform: 'none', color: '#64748b' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3 }}
            >
              {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : editId ? 'Save Changes' : 'Add Student'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Student?</DialogTitle>
        <DialogContent>
          <p className="text-slate-500 text-sm">This action cannot be undone. The student will be permanently removed.</p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ borderRadius: '10px', textTransform: 'none', color: '#64748b' }}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
