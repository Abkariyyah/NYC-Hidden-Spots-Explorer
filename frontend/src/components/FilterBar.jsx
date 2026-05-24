const categories = ['', 'Cafe', 'Bookstore', 'Park', 'Study Spot', 'Halal Food', 'Sunset Viewpoint'];
const boroughs = ['', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
const priceRanges = ['', 'Free', '$', '$$', '$$$'];

export default function FilterBar({ filters, onChange }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="search" className="mb-1 block text-xs font-medium text-slate-600">
          Search
        </label>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Name or address..."
          value={filters.search}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-xs font-medium text-slate-600">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.filter(Boolean).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="borough" className="mb-1 block text-xs font-medium text-slate-600">
          Borough
        </label>
        <select
          id="borough"
          name="borough"
          value={filters.borough}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All boroughs</option>
          {boroughs.filter(Boolean).map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="priceRange" className="mb-1 block text-xs font-medium text-slate-600">
          Price Range
        </label>
        <select
          id="priceRange"
          name="priceRange"
          value={filters.priceRange}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">Any price</option>
          {priceRanges.filter(Boolean).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
