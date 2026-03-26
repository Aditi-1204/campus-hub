export default function AnnouncementCard({ announcement }) {
  const { title, description, date, postedBy, tag } = announcement;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition border border-gray-100 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug">{title}</h3>
        {tag && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">{tag}</span>
        )}
      </div>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{description}</p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 text-xs text-gray-400">
        <span>👤 {postedBy}</span>
        <span>📅 {new Date(date).toDateString()}</span>
      </div>
    </div>
  );
}
