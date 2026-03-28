import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import api from '../../api';
import ClubCard from '../../components/ClubCard';
import FilterBar from '../../components/FilterBar';

export default function StudentClubs() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [fetching, setFetching] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const fetchClubs = async () => {
    try {
      const { data } = await api.get('/student/clubs');
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
    <div className="bg-gray-50 min-h-full p-1">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <GroupsIcon sx={{ fontSize: 18, color: '#4F46E5' }} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Clubs</h1>
        </div>
        <p className="text-sm text-gray-500 ml-10">Discover and join clubs on campus</p>
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
          <p className="text-base font-semibold text-gray-700 mb-1">No clubs found</p>
          <p className="text-sm text-gray-400">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <ClubCard
              key={c._id}
              club={c}
              isClubRole={false}
              onJoin={handleJoin}
              onViewDetails={(club) => navigate(`/student/clubs/${club._id}`)}
              loadingId={loadingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
