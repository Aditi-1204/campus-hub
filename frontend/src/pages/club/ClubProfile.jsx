import { Chip } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function ClubProfile() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
        <GroupsIcon sx={{ color: '#7c3aed' }} /> My Club
      </h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-extrabold text-purple-700 bg-purple-100">
              TC
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-extrabold text-slate-900">Tech Club</h2>
              <p className="text-slate-500 text-sm">CGU Odisha</p>
            </div>
            <Chip label="Active" sx={{ ml: 'auto', bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700 }} />
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-5">
            The Tech Club is a student-driven community focused on technology, innovation and problem-solving. We host hackathons, workshops, and tech talks to help students grow their skills.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><LocationOnIcon sx={{ fontSize: 16 }} /> Lab Block 2, CGU Campus</span>
            <span className="flex items-center gap-1"><CalendarMonthIcon sx={{ fontSize: 16 }} /> Founded 2022</span>
            <span className="flex items-center gap-1"><GroupsIcon sx={{ fontSize: 16 }} /> 48 Members</span>
          </div>
        </div>
      </div>
    </div>
  );
}
