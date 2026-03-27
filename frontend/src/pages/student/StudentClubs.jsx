import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CircularProgress, Chip, Button } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import api from '../../api';

export default function StudentClubs() {
  const [clubs, setClubs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [fetching, setFetching] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const fetchClubs = async () => {
    try {
      const { data } = await api.get('/student/clubs');
      setClubs(data.data);
      setFiltered(data.data);
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

  const handleJoin = async (club) => {
    setLoadingId(club._id);
    try {
      if (club.isJoined) {
        await api.delete(`/student/clubs/${club._id}/leave`);
        toast.success(`Left ${club.name}`);
      } else {
        await api.post(`/student/clubs/${club._id}/join`);
        toast.success(`Joined ${club.name}!`);
      }
      fetchClubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setLoadingId(null); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <GroupsIcon sx={{ color: '#7c3aed' }} /> Clubs
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Discover and join clubs on campus</p>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 20 }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clubs by name, category..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm" />
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><CircularProgress sx={{ color: '#7c3aed' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <GroupsIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
          <p className="font-semibold text-slate-600">No clubs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center relative">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-extrabold text-white border-2 border-white/30">
                  {c.name[0].toUpperCase()}
                </div>
                {c.isJoined && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Joined</div>
                )}
              </div>
              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">{c.name}</h3>
                {c.category && <Chip label={c.category} size="small" sx={{ mb: 1, alignSelf: 'flex-start', bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.6rem' }} />}
                <p className="text-xs text-slate-400 leading-relaxed flex-1 line-clamp-2 mb-2">
                  {c.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  {c.venue && <span className="flex items-center gap-1 truncate"><LocationOnIcon sx={{ fontSize: 12 }} />{c.venue}</span>}
                  <span className="flex items-center gap-1 ml-auto"><PeopleIcon sx={{ fontSize: 12 }} />{c.memberCount}</span>
                </div>
                <Button
                  variant={c.isJoined ? 'outlined' : 'contained'}
                  size="small"
                  fullWidth
                  disabled={loadingId === c._id}
                  onClick={() => handleJoin(c)}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    ...(c.isJoined
                      ? { borderColor: '#ef4444', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2', borderColor: '#dc2626' } }
                      : { bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }),
                  }}
                >
                  {loadingId === c._id ? <CircularProgress size={14} sx={{ color: 'inherit' }} /> : c.isJoined ? 'Leave Club' : 'Join Club'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
