import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import SpotForm from '../components/SpotForm';

export default function CreateSpot() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (data) => {
    setServerError('');
    try {
      const { data: spot } = await api.post('/spots', {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      });
      navigate(`/spots/${spot.id}`);
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to create spot');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Add a Hidden Spot</h1>
      <p className="mt-1 text-slate-600">Share an underrated place you love in NYC.</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <SpotForm
          onSubmit={handleSubmit}
          submitLabel="Create spot"
          serverError={serverError}
          defaultValues={{
            name: '',
            description: '',
            category: '',
            borough: '',
            address: '',
            latitude: '',
            longitude: '',
            priceRange: '',
            imageUrl: '',
          }}
        />
      </div>
    </div>
  );
}
