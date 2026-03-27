import AnnouncementIcon from '@mui/icons-material/Announcement';
import { Chip } from '@mui/material';

const ANNOUNCEMENTS = [
  { title: 'New Members Orientation', body: 'New members orientation is scheduled for next Friday at 4 PM in Seminar Hall B. All new joiners must attend.', time: '2 hours ago', tag: 'Important', tagColor: { bg: '#fef2f2', color: '#dc2626' } },
  { title: 'Hackathon Registrations Open', body: 'Hackathon registrations are now open. Last date to register is January 30. Form link shared on WhatsApp group.', time: '1 day ago', tag: 'Event', tagColor: { bg: '#eff6ff', color: '#2563eb' } },
  { title: 'T-Shirt Design Voting', body: 'Club T-shirt designs are ready for voting! Check the Google Form and cast your vote before Jan 25.', time: '3 days ago', tag: 'General', tagColor: { bg: '#f5f3ff', color: '#7c3aed' } },
  { title: 'Monthly Meeting Rescheduled', body: 'The monthly meeting originally scheduled for Jan 20 has been moved to Jan 22 at 5 PM. Same venue.', time: '5 days ago', tag: 'General', tagColor: { bg: '#f5f3ff', color: '#7c3aed' } },
  { title: 'Congratulations to Our Winners!', body: 'Shoutout to Arjun and Sneha for winning the inter-college coding competition. Proud of you both!', time: '1 week ago', tag: 'Achievement', tagColor: { bg: '#ecfdf5', color: '#059669' } },
];

export default function ClubAnnouncements() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
        <AnnouncementIcon sx={{ color: '#db2777' }} /> Announcements
      </h1>
      <div className="space-y-4">
        {ANNOUNCEMENTS.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-bold text-slate-800">{a.title}</h3>
              <Chip label={a.tag} size="small" sx={{ bgcolor: a.tagColor.bg, color: a.tagColor.color, fontWeight: 700, fontSize: '0.65rem', flexShrink: 0 }} />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">{a.body}</p>
            <p className="text-xs text-slate-400">{a.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
