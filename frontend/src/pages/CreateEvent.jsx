import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', club: '' });

  useEffect(() => {
    api.get('/clubs').then(({ data }) => setClubs(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.club) delete payload.club;
      await api.post('/events', payload);
      toast.success('Event created!');
      navigate('/events');
    } catch {
      toast.error('Failed to create event');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input required placeholder="Title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="border rounded px-3 py-2" />
        <textarea placeholder="Description" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2" rows={3} />
        <input required type="datetime-local" value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          className="border rounded px-3 py-2" />
        <input placeholder="Location" value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          className="border rounded px-3 py-2" />
        <select value={form.club} onChange={e => setForm({ ...form, club: e.target.value })}
          className="border rounded px-3 py-2">
          <option value="">No Club</option>
          {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Create Event</button>
      </form>
    </div>
  );
}
