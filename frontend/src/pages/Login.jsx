import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const { data: res } = await api.post('/auth/login', data);
      login(res.token, res.user);
      navigate('/spots');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
      <p className="mt-1 text-sm text-slate-600">Welcome back to NYC Hidden Spots.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Email *</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password *</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        New here?{' '}
        <Link to="/signup" className="font-semibold text-emerald-600 hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-2 text-center text-xs text-slate-400">
        Demo: demo@example.com / password123 (after running seed)
      </p>
    </div>
  );
}
