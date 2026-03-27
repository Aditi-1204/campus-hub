import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import toast from 'react-hot-toast';
import api from '../../api';

export default function EventRegistrations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, eventsRes] = await Promise.all([
          api.get(`/club/events/${id}/registrations`),
          api.get('/club/events'),
        ]);
        setRegistrations(regRes.data.data);
        const ev = eventsRes.data.data.find((e) => e._id === id);
        if (ev) setEvent(ev);
      } catch {
        toast.error('Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isUpcoming = event ? new Date(event.date) >= new Date() : false;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/club/events')}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-sm transition-all"
        >
          <ArrowBackIcon fontSize="small" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <EventIcon sx={{ color: '#2563eb' }} />
            {event?.title || 'Event'} — Registered Students
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{registrations.length} student{registrations.length !== 1 ? 's' : ''} registered</p>
        </div>
      </div>

      {/* Event info card */}
      {event && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex flex-wrap items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-xs font-bold flex-shrink-0 ${isUpcoming ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
            <span className="text-xl font-extrabold leading-none">{new Date(event.date).getDate()}</span>
            <span className="opacity-70">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-slate-800">{event.title}</span>
              <Chip
                label={isUpcoming ? 'Upcoming' : 'Past'}
                size="small"
                sx={{ bgcolor: isUpcoming ? '#eff6ff' : '#f8fafc', color: isUpcoming ? '#2563eb' : '#94a3b8', fontWeight: 700, fontSize: '0.65rem' }}
              />
              {event.club && (
                <Chip label={event.club.name} size="small" sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: '0.65rem' }} />
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              {event.time && <span className="flex items-center gap-1"><AccessTimeIcon sx={{ fontSize: 13 }} />{event.time}</span>}
              {event.venue && <span className="flex items-center gap-1"><LocationOnIcon sx={{ fontSize: 13 }} />{event.venue}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <CircularProgress sx={{ color: '#2563eb' }} />
          </div>
        ) : registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-400 flex items-center justify-center mb-4">
              <EventIcon sx={{ fontSize: 36 }} />
            </div>
            <p className="font-semibold text-slate-600">No students registered yet</p>
            <p className="text-sm text-slate-400 mt-1">Students will appear here once they register for this event</p>
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
              {registrations.map((r, i) => (
                <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {r.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{r.email}</td>
                  <td className="px-5 py-4">
                    {r.rollNumber
                      ? <Chip label={r.rollNumber} size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600, fontSize: '0.7rem' }} />
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{r.department || <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-4 text-slate-600">{r.year ? `Year ${r.year}` : <span className="text-slate-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
