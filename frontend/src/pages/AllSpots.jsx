import { useEffect, useState } from 'react';
import api from '../api/client';
import SpotCard from '../components/SpotCard';
import FilterBar from '../components/FilterBar';
import MapView from '../components/MapView';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function AllSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    borough: '',
    priceRange: '',
  });

  useEffect(() => {
    async function fetchSpots() {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.borough) params.borough = filters.borough;
        if (filters.priceRange) params.priceRange = filters.priceRange;

        const { data } = await api.get('/spots', { params });
        setSpots(data);
      } catch {
        setError('Could not load spots');
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(fetchSpots, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">All Hidden Spots</h1>
      <p className="mt-1 text-slate-600">Filter and explore underrated places across NYC.</p>

      <div className="mt-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {loading && <Loading />}
      {error && <div className="mt-6"><ErrorMessage message={error} /></div>}

      {!loading && !error && spots.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Map</h2>
          <MapView spots={spots} height="350px" />
        </div>
      )}

      {!loading && !error && spots.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed border-slate-300 py-12 text-center text-slate-500">
          No spots match your filters. Try adjusting them or add a new spot!
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}
