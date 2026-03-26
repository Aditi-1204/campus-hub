export default function EventCard({ event }) {
  const { title, description, date, venue, tag } = event;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition border border-gray-100 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug">{title}</h3>
        {tag && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">{tag}</span>
        )}
      </div>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{description}</p>
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-50 text-xs text-gray-400">
        <span>📅 {new Date(date).toDateString()}</span>
        {venue && <span>📍 {venue}</span>}
      </div>
    </div>
  );
}
