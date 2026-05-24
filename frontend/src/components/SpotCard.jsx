import { Link } from 'react-router-dom';

const categoryColors = {
  Cafe: 'bg-amber-100 text-amber-800',
  Bookstore: 'bg-purple-100 text-purple-800',
  Park: 'bg-green-100 text-green-800',
  'Study Spot': 'bg-blue-100 text-blue-800',
  'Halal Food': 'bg-orange-100 text-orange-800',
  'Sunset Viewpoint': 'bg-pink-100 text-pink-800',
};

export default function SpotCard({ spot, showTrending }) {
  const badgeClass = categoryColors[spot.category] || 'bg-slate-100 text-slate-700';

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-video overflow-hidden bg-slate-100">
        {spot.imageUrl ? (
          <img
            src={spot.imageUrl}
            alt={spot.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
            {spot.category}
          </span>
          <span className="text-xs text-slate-500">{spot.borough}</span>
          {showTrending && spot.trendingScore > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
              Trending
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-900">{spot.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{spot.description}</p>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
          <span>{spot.priceRange}</span>
          <span>
            ★ {spot.averageRating ?? 0} ({spot.reviews?.length ?? 0} reviews)
          </span>
        </div>

        <Link
          to={`/spots/${spot.id}`}
          className="mt-4 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
