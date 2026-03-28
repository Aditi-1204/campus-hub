import SearchIcon from '@mui/icons-material/Search';

export default function FilterBar({ search, onSearch, filters, active, onFilter, placeholder = 'Search...' }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2"
          sx={{ fontSize: 18, color: '#9CA3AF' }}
        />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition"
        />
      </div>
      {filters && (
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                active === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
