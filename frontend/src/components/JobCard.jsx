export default function JobCard({ job }) {
  const { title, company, description, date, type, eligibility } = job;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition border border-gray-100 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">{title}</h3>
          <p className="text-blue-600 text-xs font-medium mt-0.5">{company}</p>
        </div>
        {type && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 whitespace-nowrap">{type}</span>
        )}
      </div>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{description}</p>
      {eligibility && <p className="text-xs text-gray-400">🎓 {eligibility}</p>}
      <div className="mt-auto pt-2 border-t border-gray-50 text-xs text-gray-400">
        📅 Apply by {new Date(date).toDateString()}
      </div>
    </div>
  );
}
