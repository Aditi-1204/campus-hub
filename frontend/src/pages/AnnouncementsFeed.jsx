import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function AnnouncementsFeed() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/announcements')
      .then((res) => setAnnouncements(res.data))
      .catch(() => setError('Failed to load announcements.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📢 Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Official notices from faculty and administration</p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a._id || a.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition border border-gray-100">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-semibold text-gray-800 text-base">{a.title}</h2>
                  {a.tag && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">{a.tag}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{a.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                  <span>👤 {a.postedBy}</span>
                  <span>📅 {new Date(a.date).toDateString()}</span>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium">No announcements yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
