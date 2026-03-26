import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Clubs() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    api.get('/clubs').then(({ data }) => setClubs(data));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Clubs</h1>
      {clubs.length === 0 ? <p className="text-gray-500">No clubs found.</p> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {clubs.map(club => (
            <Link key={club._id} to={`/clubs/${club._id}`}
              className="border rounded p-4 hover:shadow transition block">
              <h2 className="text-lg font-semibold">{club.name}</h2>
              <p className="text-sm text-gray-500">{club.category}</p>
              <p className="text-sm mt-1">{club.description}</p>
              <p className="text-xs text-gray-400 mt-2">{club.members?.length || 0} members</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
