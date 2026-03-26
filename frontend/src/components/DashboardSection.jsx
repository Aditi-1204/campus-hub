import { useNavigate } from 'react-router-dom';

export default function DashboardSection({ title, viewAllPath, children, loading }) {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        {viewAllPath && (
          <button
            onClick={() => navigate(viewAllPath)}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            View All →
          </button>
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 animate-pulse h-36">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children}
        </div>
      )}
    </section>
  );
}
