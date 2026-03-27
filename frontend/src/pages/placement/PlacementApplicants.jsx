import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import toast from 'react-hot-toast';
import api from '../../api';

const TYPE_LABELS = {
  internship: 'Internship', job: 'Job',
  campus_drive: 'Campus Drive', workshop: 'Workshop', conference: 'Conference',
};

export default function PlacementApplicants() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const typeKey = type.replace('-', '_').replace('s', '');

  useEffect(() => {
    Promise.all([
      api.get(`/placement/manage/${id}/applicants`),
      api.get(`/placement/manage?type=${typeKey}`),
    ]).then(([a, list]) => {
      setApplicants(a.data.data);
      const found = list.data.data.find((x) => x._id === id);
      if (found) setTitle(found.title);
    }).catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [id, typeKey]);

  const backPath = `/placement/${type}`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(backPath)}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-sm transition-all">
          <ArrowBackIcon fontSize="small" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <PeopleIcon sx={{ color: '#059669' }} />
            {title || TYPE_LABELS[typeKey]} — Applicants
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><CircularProgress sx={{ color: '#059669' }} /></div>
        ) : applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PeopleIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
            <p className="font-semibold text-slate-600">No applicants yet</p>
            <p className="text-sm text-slate-400 mt-1">Students will appear here once they apply</p>
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
              {applicants.map((a, i) => (
                <tr key={a._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {a.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{a.email}</td>
                  <td className="px-5 py-4">
                    {a.rollNumber ? <Chip label={a.rollNumber} size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 600, fontSize: '0.7rem' }} /> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{a.department || <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-4 text-slate-600">{a.year ? `Year ${a.year}` : <span className="text-slate-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
