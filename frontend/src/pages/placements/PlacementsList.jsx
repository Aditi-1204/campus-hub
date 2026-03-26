import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getPlacements } from '../../services/placementService';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-6" />
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
      <div className="h-9 bg-gray-200 rounded-xl w-full" />
    </div>
  );
}

export default function PlacementsList() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPlacements()
      .then((res) => setPlacements(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">💼 Placement Opportunities</h1>
          <p className="text-blue-200 text-sm">Browse and apply to the latest campus placements</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-5 flex items-center gap-3 mb-6">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold">Failed to load placements</p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <button
              onClick={() => { setError(''); setLoading(true); getPlacements().then((r) => setPlacements(r.data)).catch((e) => setError(e.message)).finally(() => setLoading(false)); }}
              className="ml-auto text-sm font-semibold bg-red-100 hover:bg-red-200 px-4 py-1.5 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && placements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No placements yet</h2>
            <p className="text-gray-400 text-sm">Check back later for new opportunities.</p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && placements.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {placements.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-6 flex flex-col"
              >
                {/* Company badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {p.company?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-base leading-tight">{p.company}</h2>
                    <p className="text-indigo-600 text-sm font-medium">{p.role}</p>
                  </div>
                </div>

                <div className="space-y-2 flex-1 mb-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>💰</span>
                    <span className="font-semibold text-green-700">{p.package || 'Not disclosed'}</span>
                  </div>
                  {p.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📍</span>
                      <span>{p.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>⏰</span>
                    <span className={`font-medium ${new Date(p.deadline) < new Date() ? 'text-red-500' : 'text-gray-700'}`}>
                      {p.deadline ? new Date(p.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/placements/${p._id}`)}
                  className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:from-blue-800 hover:to-indigo-700 transition text-sm"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
