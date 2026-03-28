import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, IconButton, Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';

const CLUB_IMAGES = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&h=400&fit=crop',
];
const GRADIENTS = [
  'from-indigo-500 to-indigo-700', 'from-purple-500 to-purple-700',
  'from-blue-500 to-blue-700', 'from-teal-500 to-teal-700',
  'from-violet-500 to-violet-700', 'from-sky-500 to-sky-700',
];
const BADGE_STYLES = [
  'bg-indigo-100 text-indigo-700', 'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700', 'bg-teal-100 text-teal-700',
  'bg-violet-100 text-violet-700', 'bg-sky-100 text-sky-700',
];
function getIndex(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}
const SX = { mt: 2, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } };

export default function ClubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [clubsRes, membersRes, eventsRes] = await Promise.all([
        api.get('/club/clubs'),
        api.get(`/club/clubs/${id}/members`),
        api.get('/club/events'),
      ]);
      const found = clubsRes.data.data.find((c) => c._id === id);
      if (!found) { toast.error('Club not found'); navigate('/club/clubs'); return; }
      setClub(found);
      setMembers(membersRes.data.data);
      setEvents(eventsRes.data.data.filter((e) => e.club?._id === id));
    } catch { toast.error('Failed to load club'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const openEdit = () => {
    setForm({ name: club.name, description: club.description || '', category: club.category || '', venue: club.venue || '' });
    setEditOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/club/clubs/${id}`, form);
      toast.success('Club updated');
      setEditOpen(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/club/clubs/${id}`);
      toast.success('Club deleted');
      navigate('/club/clubs');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex justify-center py-24"><CircularProgress sx={{ color: '#4F46E5' }} /></div>;
  if (!club) return null;

  const idx = getIndex(club.name);
  const imgSrc = CLUB_IMAGES[idx % CLUB_IMAGES.length];
  const gradient = GRADIENTS[idx % GRADIENTS.length];
  const badgeStyle = BADGE_STYLES[idx % BADGE_STYLES.length];

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/club/clubs')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors font-medium">
        <ArrowBackIcon fontSize="small" /> Back to Clubs
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        {/* Banner */}
        <div className="relative h-52 sm:h-64 overflow-hidden">
          <img src={imgSrc} alt={club.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl font-bold text-white shadow-md`}>
            {club.name[0].toUpperCase()}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            {club.category && (
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${badgeStyle}`}>
                {club.category}
              </span>
            )}
            <h1 className="text-xl sm:text-2xl font-semibold text-white drop-shadow">{club.name}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Action bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={openEdit} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <EditIcon sx={{ fontSize: 15 }} /> Edit Club
            </button>
            <button onClick={() => setDeleteOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
              <DeleteIcon sx={{ fontSize: 15 }} /> Delete Club
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <PeopleIcon sx={{ fontSize: 15, color: '#4F46E5' }} />
              <span className="text-sm font-semibold text-gray-700">{members.length} Members</span>
            </div>
            {club.venue && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <LocationOnIcon sx={{ fontSize: 15, color: '#4F46E5' }} />
                <span className="text-sm font-semibold text-gray-700">{club.venue}</span>
              </div>
            )}
          </div>

          {club.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">About</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{club.description}</p>
            </div>
          )}

          {/* Members table */}
          {members.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Members ({members.length})</h2>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Student', 'Roll No', 'Department', 'Year'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {members.map((m) => (
                      <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                              {m.name[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 text-xs">{m.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {m.rollNumber
                            ? <Chip label={m.rollNumber} size="small" sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', fontWeight: 600, fontSize: '0.65rem' }} />
                            : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{m.department || <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{m.year ? `Year ${m.year}` : <span className="text-gray-300">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Club Events */}
          {events.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Events ({events.length})</h2>
              <div className="space-y-2">
                {events.map((ev) => {
                  const upcoming = new Date(ev.date) >= new Date();
                  return (
                    <div key={ev._id}
                      onClick={() => navigate(`/club/events/${ev._id}/details`)}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${upcoming ? 'bg-indigo-100' : 'bg-gray-200'}`}>
                        <EventIcon sx={{ fontSize: 16, color: upcoming ? '#4F46E5' : '#9CA3AF' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{ev.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <AccessTimeIcon sx={{ fontSize: 11 }} />
                            {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {ev.venue && <span className="flex items-center gap-1 truncate"><LocationOnIcon sx={{ fontSize: 11 }} />{ev.venue}</span>}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        upcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {upcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', pb: 1, color: '#111827' }}>
          Edit Club
          <IconButton onClick={() => setEditOpen(false)} sx={{ position: 'absolute', right: 16, top: 12, color: '#9CA3AF' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent sx={{ pt: 0 }}>
            <TextField label="Club Name *" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth size="small" sx={SX} />
            <TextField label="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth size="small" multiline rows={3} sx={SX} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Category" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth size="small" sx={{ mt: 1, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
              <TextField label="Venue" value={form.venue || ''} onChange={(e) => setForm({ ...form, venue: e.target.value })} fullWidth size="small" sx={{ mt: 1, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            </div>
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
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>Delete Club?</DialogTitle>
        <DialogContent><p className="text-sm text-gray-500">This will also delete all events linked to this club.</p></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ borderRadius: '10px', color: '#6B7280', textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
