import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [rsvpCount, setRsvpCount] = useState(0);

  useEffect(() => {
    api.get(`/events/${id}`).then(({ data }) => {
      setEvent(data);
      setRsvpCount(data.rsvps?.length || 0);
    });
  }, [id]);

  const handleRSVP = async () => {
    try {
      const { data } = await api.post(`/events/${id}/rsvp`, { userId: 'guest' });
      setRsvpCount(data.rsvpCount);
      toast.success('RSVP successful!');
    } catch {
      toast.error('RSVP failed');
    }
  };

  if (!event) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-500 mb-1">{new Date(event.date).toLocaleString()} · {event.location}</p>
      {event.club && <p className="text-blue-600 mb-4">Club: {event.club.name}</p>}
      <p className="mb-6">{event.description}</p>
      <div className="flex items-center gap-4">
        <button onClick={handleRSVP} className="bg-green-600 text-white px-5 py-2 rounded">RSVP</button>
        <span className="text-gray-500 text-sm">{rsvpCount} people going</span>
      </div>
    </div>
  );
}
