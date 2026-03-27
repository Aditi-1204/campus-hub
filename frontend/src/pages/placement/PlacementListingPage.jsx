import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, CircularProgress, Chip, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import LinkIcon from '@mui/icons-material/Link';
import api from '../../api';

const TYPE_CONFIG = {
  internship:   { label: 'Internship',   color: '#2563eb', bg: 'from-blue-500 to-indigo-600',   light: '#eff6ff',  chip: { bgcolor: '#eff6ff', color: '#2563eb' } },
  job:          { label: 'Job',           color: '#059669', bg: 'from-emerald-500 to-teal-600',  light: '#ecfdf5',  chip: { bgcolor: '#ecfdf5', color: '#059669' } },
  campus_drive: { label: 'Campus Drive',  color: '#7c3aed', bg: 'from-purple-500 to-violet-600', light: '#f5f3ff',  chip: { bgcolor: '#f5f3ff', color: '#7c3aed' } },
  workshop:     { label: 'Workshop',      color: '#ea580c', bg: 'from-orange-500 to-red-500',    light: '#fff7ed',  chip: { bgcolor: '#fff7ed', color: '#ea580c' } },
  conference:   { label: 'Conference',    color: '#db2777', bg: 'from-pink-500 to-rose-600',     light: '#fdf2f8',  chip: { bgcolor: '#fdf2f8', color: '#db2777' } },
};

const EMPTY = { title: '', company: '', description: '', location: '', deadline: '', date: '', stipend: '', salary: '', eligibility: '', applyLink: '' };

const fsx = { mt: 2, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } };

export default function PlacementListingPage({ type }) {
  const cfg = TYPE_CONFIG[type];
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetch = async () => {
    try {
      const { data } = await api.get(`/placement/manage?type=${type}`);
      setItems(data.data);
    } catch { toast.error('Failed to load'); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetch(); }, [type]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setOpen(true); };
  const openEdit = (item) => {
    setForm({
      title: item.title, company: item.company || '', description: item.description || '',
      location: item.location || '', deadline: item.deadline ? item.deadline.split('T')[0] : '',
      date: item.date ? item.date.split('T')[0] : '',
      stipend: item.stipend || '', salary: item.salary || '',
      eligibility: item.eligibility || '', applyLink: item.applyLink || '',
    });
    setEditId(item._id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, type };
      if (editId) { await api.put(`/placement/manage/${editId}`, payload); toast.success(`${cfg.label} updated`); }
      else { await api.post('/placement/manage', payload); toast.success(`${cfg.label} created`); }
      setOpen(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/placement/manage/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetch();
    } catch { toast.error('Failed to delete'); }
  };

  const tf = (label, key, opts = {}) => (
    <TextField key={key} label={label} value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      fullWidth size="small" sx={fsx} {...opts} />
  );

  const isActive = (item) => !item.deadline || new Date(item.deadline) >= new Date();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{cfg.label}s</h1>
          <p className="text-slate-400 text-sm mt-0.5">{items.length} listing{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ bgcolor: cfg.color, '&:hover': { bgcolor: cfg.color, filter: 'brightness(0.9)' }, borderRadius: '10px', fontWeight: 700, px: 3 }}>
          Add {cfg.label}
        </Button>
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><CircularProgress sx={{ color: cfg.color }} /></div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <p className="font-semibold text-slate-600 mb-1">No {cfg.label.toLowerCase()}s yet</p>
          <p className="text-sm text-slate-400 mb-4">Create your first listing</p>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
            sx={{ bgcolor: cfg.color, '&:hover': { bgcolor: cfg.color, filter: 'brightness(0.9)' }, borderRadius: '10px', fontWeight: 700 }}>
            Add {cfg.label}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
              {/* Banner */}
              <div className={`h-24 bg-gradient-to-br ${cfg.bg} flex flex-col items-center justify-center px-3 relative`}>
                <p className="text-white font-extrabold text-sm text-center leading-tight line-clamp-2">{item.title}</p>
                {item.company && <p className="text-white/70 text-xs mt-1 truncate">{item.company}</p>}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive(item) ? 'bg-white/20 text-white' : 'bg-black/20 text-white/70'}`}>
                    {isActive(item) ? 'Active' : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="space-y-1.5 mb-3 flex-1">
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <LocationOnIcon sx={{ fontSize: 13 }} /><span className="truncate">{item.location}</span>
                    </div>
                  )}
                  {(item.stipend || item.salary) && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <BusinessIcon sx={{ fontSize: 13 }} />{item.stipend || item.salary}
                    </div>
                  )}
                  {item.deadline && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <CalendarMonthIcon sx={{ fontSize: 13 }} />Deadline: {new Date(item.deadline).toLocaleDateString()}
                    </div>
                  )}
                  {item.date && (
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <CalendarMonthIcon sx={{ fontSize: 13 }} />Date: {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <PeopleIcon sx={{ fontSize: 13 }} />{item.applicants?.length || 0} applicants
                  </div>
                </div>

                {item.eligibility && (
                  <p className="text-xs text-slate-400 line-clamp-1 mb-3 italic">Eligibility: {item.eligibility}</p>
                )}

                {/* Actions */}
                <div className="flex gap-1.5 mt-auto pt-3 border-t border-slate-100">
                  <button onClick={() => navigate(`/placement/${type.replace('_', '-')}s/${item._id}/applicants`)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                    style={{ color: cfg.color, background: cfg.light }}>
                    <VisibilityIcon sx={{ fontSize: 13 }} /> View
                  </button>
                  <button onClick={() => openEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 py-1.5 rounded-lg transition-colors">
                    <EditIcon sx={{ fontSize: 13 }} /> Edit
                  </button>
                  <button onClick={() => setDeleteId(item._id)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg transition-colors">
                    <DeleteIcon sx={{ fontSize: 13 }} /> Delete
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
          {editId ? `Edit ${cfg.label}` : `Add ${cfg.label}`}
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#94a3b8' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 0 }}>
            {tf('Title *', 'title', { required: true })}
            {tf('Company / Organisation', 'company')}
            {tf('Description', 'description', { multiline: true, rows: 2 })}
            <div className="grid grid-cols-2 gap-3">
              {tf('Location', 'location')}
              {tf('Eligibility', 'eligibility')}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(type === 'internship') && tf('Stipend', 'stipend')}
              {(type === 'job') && tf('Salary / CTC', 'salary')}
              {tf('Deadline', 'deadline', { type: 'date', InputLabelProps: { shrink: true } })}
              {(type === 'campus_drive' || type === 'workshop' || type === 'conference') &&
                tf('Event Date', 'date', { type: 'date', InputLabelProps: { shrink: true } })}
            </div>
            {tf('Apply Link / URL', 'applyLink', { InputProps: { startAdornment: <LinkIcon sx={{ fontSize: 16, mr: 1, color: '#94a3b8' }} /> } })}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={() => setOpen(false)} sx={{ borderRadius: '10px', color: '#64748b' }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}
              sx={{ bgcolor: cfg.color, '&:hover': { bgcolor: cfg.color, filter: 'brightness(0.9)' }, borderRadius: '10px', fontWeight: 700, px: 3 }}>
              {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : editId ? 'Save Changes' : `Add ${cfg.label}`}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete {cfg.label}?</DialogTitle>
        <DialogContent><p className="text-slate-500 text-sm">This action cannot be undone.</p></DialogContent>
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
