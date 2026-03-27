import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CircularProgress, Chip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import LinkIcon from '@mui/icons-material/Link';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import api from '../../api';

const TYPE_CONFIG = {
  internship:   { label: 'Internship',  plural: 'Internships',  color: '#2563eb', bg: 'from-blue-500 to-indigo-600',   light: '#eff6ff',  icon: <SchoolIcon /> },
  job:          { label: 'Job',         plural: 'Jobs',         color: '#059669', bg: 'from-emerald-500 to-teal-600',  light: '#ecfdf5',  icon: <WorkIcon /> },
  campus_drive: { label: 'Campus Drive',plural: 'Campus Drives',color: '#7c3aed', bg: 'from-purple-500 to-violet-600', light: '#f5f3ff',  icon: <DirectionsCarIcon /> },
  workshop:     { label: 'Workshop',    plural: 'Workshops',    color: '#ea580c', bg: 'from-orange-500 to-red-500',    light: '#fff7ed',  icon: <BuildIcon /> },
  conference:   { label: 'Conference',  plural: 'Conferences',  color: '#db2777', bg: 'from-pink-500 to-rose-600',     light: '#fdf2f8',  icon: <EmojiEventsIcon /> },
};

export default function StudentPlacementPage({ type }) {
  const cfg = TYPE_CONFIG[type];
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [fetching, setFetching] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const fetchItems = async () => {
    try {
      const { data } = await api.get(`/placement?type=${type}`);
      setItems(data.data);
      setFiltered(data.data);
    } catch { toast.error('Failed to load'); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchItems(); }, [type]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(items.filter((i) =>
      i.title.toLowerCase().includes(q) ||
      (i.company || '').toLowerCase().includes(q) ||
      (i.location || '').toLowerCase().includes(q) ||
      (i.description || '').toLowerCase().includes(q)
    ));
  }, [search, items]);

  const handleApply = async (item) => {
    setLoadingId(item._id);
    try {
      if (item.hasApplied) {
        await api.delete(`/placement/${item._id}/withdraw`);
        toast.success('Application withdrawn');
      } else {
        await api.post(`/placement/${item._id}/apply`);
        toast.success('Applied successfully!');
      }
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setLoadingId(null); }
  };

  const isActive = (item) => !item.deadline || new Date(item.deadline) >= new Date();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <span style={{ color: cfg.color }}>{cfg.icon}</span> {cfg.plural}
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">{items.length} listing{items.length !== 1 ? 's' : ''} available</p>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 20 }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${cfg.plural.toLowerCase()}...`}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 shadow-sm"
          style={{ '--tw-ring-color': cfg.color }} />
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><CircularProgress sx={{ color: cfg.color }} /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <span style={{ color: '#e2e8f0', fontSize: 48 }}>{cfg.icon}</span>
          <p className="font-semibold text-slate-600 mt-3">No {cfg.plural.toLowerCase()} available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const active = isActive(item);
            return (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
                {/* Banner */}
                <div className={`h-24 bg-gradient-to-br ${cfg.bg} flex flex-col items-center justify-center px-3 relative`}>
                  <p className="text-white font-extrabold text-sm text-center leading-tight line-clamp-2">{item.title}</p>
                  {item.company && <p className="text-white/70 text-xs mt-1 truncate max-w-full">{item.company}</p>}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-black/20 text-white/60'}`}>
                      {active ? 'Open' : 'Closed'}
                    </span>
                    {item.hasApplied && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">Applied</span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="space-y-1.5 flex-1 mb-3">
                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <LocationOnIcon sx={{ fontSize: 13 }} /><span className="truncate">{item.location}</span>
                      </div>
                    )}
                    {(item.stipend || item.salary) && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <BusinessIcon sx={{ fontSize: 13 }} />{item.stipend || item.salary}
                      </div>
                    )}
                    {item.deadline && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <CalendarMonthIcon sx={{ fontSize: 13 }} />Deadline: {new Date(item.deadline).toLocaleDateString()}
                      </div>
                    )}
                    {item.date && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <CalendarMonthIcon sx={{ fontSize: 13 }} />Date: {new Date(item.date).toLocaleDateString()}
                      </div>
                    )}
                    {item.eligibility && (
                      <div className="text-xs text-slate-400 italic line-clamp-1">Eligibility: {item.eligibility}</div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <PeopleIcon sx={{ fontSize: 13 }} />{item.applicantCount} applied
                    </div>
                  </div>

                  {/* Apply link */}
                  {item.applyLink && (
                    <a href={item.applyLink} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold mb-3 hover:underline"
                      style={{ color: cfg.color }}>
                      <LinkIcon sx={{ fontSize: 13 }} /> Official Link
                    </a>
                  )}

                  <Button
                    variant={item.hasApplied ? 'outlined' : 'contained'}
                    size="small"
                    fullWidth
                    disabled={loadingId === item._id || !active}
                    onClick={() => handleApply(item)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      ...(item.hasApplied
                        ? { borderColor: '#ef4444', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2', borderColor: '#dc2626' } }
                        : { bgcolor: cfg.color, '&:hover': { bgcolor: cfg.color, filter: 'brightness(0.9)' } }),
                    }}
                  >
                    {loadingId === item._id
                      ? <CircularProgress size={14} sx={{ color: 'inherit' }} />
                      : !active ? 'Closed'
                      : item.hasApplied ? 'Withdraw' : 'Apply Now'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
