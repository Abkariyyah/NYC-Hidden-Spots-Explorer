import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ReviewForm({ onSubmit, initialValues, submitLabel = 'Submit Review' }) {
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues || { rating: 5, comment: '' },
  });

  const handleFormSubmit = async (data) => {
    setServerError('');
    try {
      await onSubmit(data);
      if (!initialValues) reset({ rating: 5, comment: '' });
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to save review');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      {serverError && (
        <p className="text-sm text-red-600">{serverError}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Rating (1-5) *</label>
        <select
          {...register('rating', {
            required: 'Rating is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Min rating is 1' },
            max: { value: 5, message: 'Max rating is 5' },
          })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} ★</option>
          ))}
        </select>
        {errors.rating && (
          <p className="mt-1 text-xs text-red-600">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Comment *</label>
        <textarea
          rows={3}
          {...register('comment', { required: 'Comment is required' })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {errors.comment && (
          <p className="mt-1 text-xs text-red-600">{errors.comment.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
