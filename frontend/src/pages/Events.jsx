import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [clubFilter, setClubFilter] = useState('');

  const fetchEvents = async () => {
    const params = {};
    if (dateFilter) params.date = dateFilter;
    if (clubFilter) params.club = clubFilter;
    const { data } = await api.get('/events', { params });
    setEvents(data);
  };

  useEffect(() => {
    api.get('/clubs').then(({ data }) => setClubs(data));
  }, []);

  useEffect(() => { fetchEvents(); }, [dateFilter, clubFilter]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link to="/events/create" className="bg-blue-600 text-white px-4 py-2 rounded">+ Create Event</Link>
      </div>

      <div className="flex gap-4 mb-6">
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          className="border rounded px-3 py-2" />
        <select value={clubFilter} onChange={e => setClubFilter(e.target.value)}
          className="border rounded px-3 py-2">
          <option value="">All Clubs</option>
          {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button onClick={() => { setDateFilter(''); setClubFilter(''); }}
          className="text-sm text-gray-500 underline">Clear</button>
      </div>

      {events.length === 0 ? <p className="text-gray-500">No events found.</p> : (
        <div className="grid gap-4">
          {events.map(event => (
            <Link key={event._id} to={`/events/${event._id}`}
              className="border rounded p-4 hover:shadow transition block">
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} · {event.location}</p>
              {event.club && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{event.club.name}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
