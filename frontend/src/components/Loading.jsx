export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
}
