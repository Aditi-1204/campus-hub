import { Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const EVENTS = [
  { title: 'Tech Talk: AI in 2025', date: 'Jan 28, 2025', time: '3:00 PM', venue: 'Seminar Hall A', status: 'Upcoming', color: '#eff6ff', textColor: '#2563eb' },
  { title: 'Hackathon Kickoff', date: 'Feb 5, 2025', time: '10:00 AM', venue: 'Lab Block 2', status: 'Upcoming', color: '#eff6ff', textColor: '#2563eb' },
  { title: 'Annual Club Meet', date: 'Feb 15, 2025', time: '5:00 PM', venue: 'Auditorium', status: 'Upcoming', color: '#eff6ff', textColor: '#2563eb' },
  { title: 'Web Dev Workshop', date: 'Dec 10, 2024', time: '2:00 PM', venue: 'Lab Block 1', status: 'Completed', color: '#f0fdf4', textColor: '#16a34a' },
  { title: 'Open Source Sprint', date: 'Nov 20, 2024', time: '9:00 AM', venue: 'Online', status: 'Completed', color: '#f0fdf4', textColor: '#16a34a' },
];

export default function ClubEvents() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
        <EventIcon sx={{ color: '#2563eb' }} /> Events
      </h1>
      <div className="space-y-4">
        {EVENTS.map((e) => (
          <div key={e.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center text-xs font-bold flex-shrink-0">
              <span className="text-lg font-extrabold leading-none">{e.date.split(' ')[1].replace(',', '')}</span>
              <span className="text-blue-400">{e.date.split(' ')[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-800">{e.title}</h3>
                <Chip label={e.status} size="small" sx={{ bgcolor: e.color, color: e.textColor, fontWeight: 700, fontSize: '0.65rem' }} />
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><AccessTimeIcon sx={{ fontSize: 13 }} />{e.time}</span>
                <span className="flex items-center gap-1"><LocationOnIcon sx={{ fontSize: 13 }} />{e.venue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
