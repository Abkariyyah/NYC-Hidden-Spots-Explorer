import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import SpotForm from '../components/SpotForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function EditSpot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/spots/${id}`);
        if (user && data.userId !== user.id) {
          setError('You can only edit your own spots');
        } else {
          setSpot(data);
        }
      } catch {
        setError('Spot not found');
      } finally {
        setLoading(false);
      }
    }
    if (user) load();
  }, [id, user]);

  const handleSubmit = async (data) => {
    setServerError('');
    try {
      await api.put(`/spots/${id}`, {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      });
      navigate(`/spots/${id}`);
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to update spot');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Edit Hidden Spot</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <SpotForm
          defaultValues={{
            name: spot.name,
            description: spot.description,
            category: spot.category,
            borough: spot.borough,
            address: spot.address,
            latitude: spot.latitude,
            longitude: spot.longitude,
            priceRange: spot.priceRange,
            imageUrl: spot.imageUrl || '',
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          serverError={serverError}
        />
      </div>
    </div>
  );
}
