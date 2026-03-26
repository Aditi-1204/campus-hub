import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    api.get(`/clubs/${id}`).then(({ data }) => {
      setClub(data);
      setMemberCount(data.members?.length || 0);
    });
  }, [id]);

  const handleJoin = async () => {
    try {
      const { data } = await api.post(`/clubs/${id}/join`, { userId: 'guest' });
      setMemberCount(data.memberCount);
      toast.success('Joined club!');
    } catch {
      toast.error('Failed to join');
    }
  };

  if (!club) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
      {club.category && <p className="text-blue-600 mb-2">{club.category}</p>}
      <p className="mb-6">{club.description}</p>
      <div className="flex items-center gap-4">
        <button onClick={handleJoin} className="bg-blue-600 text-white px-5 py-2 rounded">Join Club</button>
        <span className="text-gray-500 text-sm">{memberCount} members</span>
      </div>
    </div>
  );
}
