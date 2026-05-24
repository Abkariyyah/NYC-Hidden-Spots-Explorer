import { useForm } from 'react-hook-form';

const categories = ['Cafe', 'Bookstore', 'Park', 'Study Spot', 'Halal Food', 'Sunset Viewpoint'];
const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
const priceRanges = ['Free', '$', '$$', '$$$'];

export default function SpotForm({ defaultValues, onSubmit, submitLabel, serverError }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
        <input
          {...register('name', { required: 'Name is required' })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description *</label>
        <textarea
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category *</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Borough *</label>
          <select
            {...register('borough', { required: 'Borough is required' })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Select borough</option>
            {boroughs.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {errors.borough && (
            <p className="mt-1 text-xs text-red-600">{errors.borough.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Address *</label>
        <input
          {...register('address', { required: 'Address is required' })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Latitude *</label>
          <input
            type="number"
            step="any"
            {...register('latitude', {
              required: 'Latitude is required',
              min: { value: -90, message: 'Invalid latitude' },
              max: { value: 90, message: 'Invalid latitude' },
            })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {errors.latitude && (
            <p className="mt-1 text-xs text-red-600">{errors.latitude.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Longitude *</label>
          <input
            type="number"
            step="any"
            {...register('longitude', {
              required: 'Longitude is required',
              min: { value: -180, message: 'Invalid longitude' },
              max: { value: 180, message: 'Invalid longitude' },
            })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {errors.longitude && (
            <p className="mt-1 text-xs text-red-600">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Tip: Right-click a location on Google Maps and copy the coordinates.
      </p>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Price Range *</label>
        <select
          {...register('priceRange', { required: 'Price range is required' })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="">Select price</option>
          {priceRanges.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.priceRange && (
          <p className="mt-1 text-xs text-red-600">{errors.priceRange.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Image URL</label>
        <input
          type="url"
          {...register('imageUrl')}
          placeholder="https://..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
