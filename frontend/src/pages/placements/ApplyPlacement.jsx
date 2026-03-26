import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { getPlacementById, applyPlacement } from '../../services/placementService';
import { useAuth } from '../../context/AuthContext';

export default function ApplyPlacement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPlacementById(id)
      .then((res) => setPlacement(res.data))
      .catch(() => { toast.error('Failed to load placement'); navigate('/placements'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setSubmitting(true);
    try {
      await applyPlacement(id);
      toast.success('Application submitted successfully! 🎉');
      navigate(user?.role === 'student' ? '/dashboard' : '/placements');
    } catch (err) {
      toast.error(err.message || 'Failed to apply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-16 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
        <div className="h-40 bg-gray-100 rounded-2xl" />
        <div className="h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white px-6 py-10">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-4xl mb-2">🚀</div>
          <h1 className="text-2xl font-bold">Confirm Application</h1>
          <p className="text-blue-200 text-sm mt-1">Review the details before submitting</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
        {/* Placement Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              {placement?.company?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{placement?.company}</h2>
              <p className="text-indigo-600 text-sm font-medium">{placement?.role}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Package</p>
              <p className="font-semibold text-green-700">{placement?.package || 'Not disclosed'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Location</p>
              <p className="font-semibold text-gray-700">{placement?.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Deadline</p>
              <p className="font-semibold text-gray-700">
                {placement?.deadline ? new Date(placement.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Applicant</p>
              <p className="font-semibold text-gray-700">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex gap-2">
          <span>⚠️</span>
          <span>Once submitted, your application cannot be withdrawn. Make sure you meet the eligibility criteria.</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/placements/${id}`)}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-800 hover:to-indigo-700 transition text-sm disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Confirm & Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
