import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';
import toast from 'react-hot-toast';
import api from '../../api';

export default function ClubMembers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [clubName, setClubName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, clubsRes] = await Promise.all([
          api.get(`/club/clubs/${id}/members`),
          api.get('/club/clubs'),
        ]);
        setMembers(membersRes.data.data);
        const club = clubsRes.data.data.find((c) => c._id === id);
        if (club) setClubName(club.name);
      } catch {
        toast.error('Failed to load members');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/club/clubs')}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-sm transition-all"
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <GroupsIcon sx={{ color: '#7c3aed' }} />
            {clubName || 'Club'} — Enrolled Students
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{members.length} student{members.length !== 1 ? 's' : ''} enrolled</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <CircularProgress sx={{ color: '#7c3aed' }} />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-400 flex items-center justify-center mb-4">
              <GroupsIcon sx={{ fontSize: 36 }} />
            </div>
            <p className="font-semibold text-slate-600">No students enrolled yet</p>
            <p className="text-sm text-slate-400 mt-1">Students will appear here once they join this club</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['#', 'Student', 'Email', 'Roll No', 'Department', 'Year'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((m, i) => (
                <tr key={m._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {m.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{m.email}</td>
                  <td className="px-5 py-4">
                    {m.rollNumber
                      ? <Chip label={m.rollNumber} size="small" sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.7rem' }} />
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{m.department || <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-4 text-slate-600">{m.year ? `Year ${m.year}` : <span className="text-slate-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
