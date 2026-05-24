import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import ReviewForm from '../components/ReviewForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function SpotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);

  const fetchSpot = async () => {
    try {
      const { data } = await api.get(`/spots/${id}`);
      setSpot(data);
    } catch {
      setError('Spot not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpot();
  }, [id]);

  const handleSaveToggle = async () => {
    try {
      if (spot.isSaved) {
        await api.delete(`/spots/${id}/save`);
        setSpot({ ...spot, isSaved: false, saveCount: Math.max(0, spot.saveCount - 1) });
      } else {
        await api.post(`/spots/${id}/save`);
        setSpot({ ...spot, isSaved: true, saveCount: spot.saveCount + 1 });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Could not update saved status');
    }
  };

  const handleDeleteSpot = async () => {
    if (!window.confirm('Delete this spot permanently?')) return;
    try {
      await api.delete(`/spots/${id}`);
      navigate('/spots');
    } catch (err) {
      alert(err.response?.data?.error || 'Could not delete spot');
    }
  };

  const handleAddReview = async (data) => {
    await api.post(`/spots/${id}/reviews`, data);
    setLoading(true);
    await fetchSpot();
    setLoading(false);
  };

  const handleUpdateReview = async (reviewId, data) => {
    await api.put(`/reviews/${reviewId}`, data);
    setEditingReviewId(null);
    await fetchSpot();
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    await api.delete(`/reviews/${reviewId}`);
    await fetchSpot();
  };

  if (loading) return <Loading />;
  if (error || !spot) return <ErrorMessage message={error || 'Spot not found'} />;

  const isOwner = user?.id === spot.userId;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {spot.imageUrl && (
          <img src={spot.imageUrl} alt={spot.name} className="h-64 w-full object-cover sm:h-80" />
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                {spot.category}
              </span>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{spot.name}</h1>
              <p className="mt-1 text-slate-600">{spot.address} · {spot.borough}</p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p className="text-lg font-semibold text-amber-600">★ {spot.averageRating}</p>
              <p>{spot.reviews?.length || 0} reviews · {spot.saveCount} saves</p>
              <p className="mt-1">{spot.priceRange}</p>
            </div>
          </div>

          <p className="mt-4 text-slate-700">{spot.description}</p>
          <p className="mt-2 text-sm text-slate-500">Added by {spot.user?.name}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleSaveToggle}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  spot.isSaved
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {spot.isSaved ? 'Unsave' : 'Save spot'}
              </button>
            )}
            {isOwner && (
              <>
                <Link
                  to={`/spots/${id}/edit`}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteSpot}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Location</h2>
        <MapView singleSpot={spot} height="300px" />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Reviews</h2>

        {isLoggedIn && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-slate-700">Write a review</h3>
            <ReviewForm onSubmit={handleAddReview} />
          </div>
        )}

        {!isLoggedIn && (
          <p className="mt-4 text-sm text-slate-500">
            <Link to="/login" className="text-emerald-600 hover:underline">Log in</Link> to leave a review.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {spot.reviews?.length === 0 && (
            <p className="text-slate-500">No reviews yet. Be the first!</p>
          )}

          {spot.reviews?.map((review) => (
            <div key={review.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              {editingReviewId === review.id ? (
                <ReviewForm
                  initialValues={{ rating: review.rating, comment: review.comment }}
                  submitLabel="Update review"
                  onSubmit={(data) => handleUpdateReview(review.id, data)}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-slate-900">{review.user?.name}</span>
                      <span className="ml-2 text-amber-600">{'★'.repeat(review.rating)}</span>
                    </div>
                    {user?.id === review.userId && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(review.id)}
                          className="text-xs text-emerald-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-slate-700">{review.comment}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
