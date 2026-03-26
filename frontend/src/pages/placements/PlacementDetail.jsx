import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getPlacementById } from '../../services/placementService';
import { useAuth } from '../../context/AuthContext';

export default function PlacementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPlacementById(id)
      .then((res) => setPlacement(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const alreadyApplied = placement?.applicants?.includes(user?._id);
  const isExpired = placement?.deadline && new Date(placement.deadline) < new Date();

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-40 bg-gray-100 rounded-2xl mt-6" />
        <div className="h-12 bg-gray-200 rounded-xl w-40" />
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Failed to load placement</h2>
        <p className="text-gray-400 text-sm mb-6">{error}</p>
        <button onClick={() => navigate('/placements')} className="bg-blue-800 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-900 transition">
          ← Back to Placements
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/placements')} className="text-blue-200 text-sm hover:text-white mb-4 flex items-center gap-1 transition">
            ← Back to Placements
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
              {placement.company?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{placement.company}</h1>
              <p className="text-blue-200">{placement.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '💰', label: 'Package', value: placement.package || 'Not disclosed' },
            { icon: '📍', label: 'Location', value: placement.location || 'Not specified' },
            { icon: '⏰', label: 'Deadline', value: placement.deadline ? new Date(placement.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A' },
            { icon: '👥', label: 'Applicants', value: placement.applicants?.length ?? 0 },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="font-bold text-gray-800 text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {placement.description && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-700 mb-3 text-base">📋 Job Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{placement.description}</p>
          </div>
        )}

        {/* Eligibility */}
        {placement.eligibility && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-700 mb-3 text-base">✅ Eligibility Criteria</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{placement.eligibility}</p>
          </div>
        )}

        {/* Apply Button — students only */}
        {user?.role === 'student' && (
          <div className="flex gap-3">
            <button
              disabled={alreadyApplied || isExpired}
              onClick={() => navigate(`/placements/${id}/apply`)}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition ${
                alreadyApplied
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : isExpired
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-700 to-indigo-600 text-white hover:from-blue-800 hover:to-indigo-700'
              }`}
            >
              {alreadyApplied ? '✅ Already Applied' : isExpired ? '⛔ Deadline Passed' : '🚀 Apply Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
