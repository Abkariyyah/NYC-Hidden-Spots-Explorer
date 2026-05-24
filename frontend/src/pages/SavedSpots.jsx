import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import SpotCard from '../components/SpotCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function SavedSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSaved() {
      try {
        const { data } = await api.get('/saved');
        setSpots(data);
      } catch {
        setError('Could not load saved spots');
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Saved Spots</h1>
      <p className="mt-1 text-slate-600">Your favorite hidden gems in one place.</p>

      {loading && <Loading />}
      {error && <div className="mt-6"><ErrorMessage message={error} /></div>}

      {!loading && !error && spots.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-slate-500">You have not saved any spots yet.</p>
          <Link to="/spots" className="mt-3 inline-block text-emerald-600 hover:underline">
            Browse spots to save some →
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}
