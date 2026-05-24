import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import SpotCard from '../components/SpotCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTrending() {
      try {
        const { data } = await api.get('/spots/trending');
        setTrending(data);
      } catch {
        setError('Could not load trending spots');
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-12 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">NYC Hidden Spots Explorer</h1>
        <p className="mt-4 max-w-2xl text-emerald-50">
          Discover underrated gems across New York City — cozy cafes, quiet study spots,
          halal food, sunset viewpoints, and more. Share your favorites and help others
          explore beyond the usual tourist lists.
        </p>
        <Link
          to="/spots"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          Browse all spots
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900">Trending Hidden Spots</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ranked by ratings and saves: score = average rating × 2 + save count
        </p>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && trending.length === 0 && (
          <p className="mt-6 text-slate-500">No trending spots yet. Be the first to add one!</p>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((spot) => (
            <SpotCard key={spot.id} spot={spot} showTrending />
          ))}
        </div>
      </section>
    </div>
  );
}
