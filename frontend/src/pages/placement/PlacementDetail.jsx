import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api';

const TYPE_CONFIG = {
  internship:   { label: 'Internship',   bg: 'from-blue-500 to-indigo-600',   color: '#2563eb', light: '#eff6ff' },
  job:          { label: 'Job',           bg: 'from-emerald-500 to-teal-600',  color: '#059669', light: '#ecfdf5' },
  campus_drive: { label: 'Campus Drive',  bg: 'from-purple-500 to-violet-600', color: '#7c3aed', light: '#f5f3ff' },
  workshop:     { label: 'Workshop',      bg: 'from-orange-500 to-red-500',    color: '#ea580c', light: '#fff7ed' },
  conference:   { label: 'Conference',    bg: 'from-pink-500 to-rose-600',     color: '#db2777', light: '#fdf2f8' },
};

export default function PlacementDetailPage({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const cfg = TYPE_CONFIG[type];
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/placement/manage?type=${type}`)
      .then(({ data }) => {
        const found = data.data.find((d) => d._id === id);
        setItem(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, type]);

  const isActive = (d) => !d.deadline || new Date(d.deadline) >= new Date();

  if (loading) return <div className="flex justify-center py-24"><CircularProgress sx={{ color: cfg.color }} /></div>;
  if (!item) return <div className="text-center py-24 text-slate-500">Listing not found.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back
      </button>

      {/* Banner */}
      <div className={`rounded-xl bg-gradient-to-r ${cfg.bg} p-8 mb-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block ${isActive(item) ? 'bg-white/20 text-white' : 'bg-black/20 text-white/70'}`}>
          {isActive(item) ? 'Active' : 'Closed'}
        </span>
        <h1 className="text-2xl font-extrabold text-white leading-tight">{item.title}</h1>
        {item.company && <p className="text-white/80 mt-1 text-sm">{item.company}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 space-y-4">
          {item.description && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-slate-700 text-sm leading-relaxed">{item.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {item.location && (
              <div className="flex items-start gap-2">
                <LocationOnIcon sx={{ fontSize: 16, color: cfg.color, mt: 0.3 }} />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Location</p>
                  <p className="text-sm text-slate-700">{item.location}</p>
                </div>
              </div>
            )}
            {(item.stipend || item.salary) && (
              <div className="flex items-start gap-2">
                <BusinessIcon sx={{ fontSize: 16, color: cfg.color, mt: 0.3 }} />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{item.stipend ? 'Stipend' : 'Salary'}</p>
                  <p className="text-sm text-slate-700">{item.stipend || item.salary}</p>
                </div>
              </div>
            )}
            {item.deadline && (
              <div className="flex items-start gap-2">
                <CalendarMonthIcon sx={{ fontSize: 16, color: cfg.color, mt: 0.3 }} />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Deadline</p>
                  <p className="text-sm text-slate-700">{new Date(item.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {item.date && (
              <div className="flex items-start gap-2">
                <CalendarMonthIcon sx={{ fontSize: 16, color: cfg.color, mt: 0.3 }} />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Event Date</p>
                  <p className="text-sm text-slate-700">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {item.eligibility && (
              <div className="flex items-start gap-2 col-span-2">
                <PeopleIcon sx={{ fontSize: 16, color: cfg.color, mt: 0.3 }} />
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Eligibility</p>
                  <p className="text-sm text-slate-700">{item.eligibility}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Status</p>
            <span className={`text-xs font-bold px-3 py-1 rounded-full`}
              style={{ background: isActive(item) ? cfg.light : '#f1f5f9', color: isActive(item) ? cfg.color : '#64748b' }}>
              {isActive(item) ? 'Active' : 'Closed'}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Applicants</p>
            <p className="text-sm font-semibold text-slate-700">{item.applicants?.length || 0}</p>
          </div>
          {item.applyLink && (
            <a href={item.applyLink} target="_blank" rel="noopener noreferrer"
              className="mt-auto block text-center text-sm font-bold py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(to right, ${cfg.color}, ${cfg.color}cc)` }}>
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
