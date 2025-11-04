import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function MovieForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${API_BASE}/movies`);
      const data = await res.json();
      setMovies(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', title);
      if (description) form.append('description', description);
      if (duration) form.append('duration_minutes', duration);
      if (file) form.append('image', file);

      const res = await fetch(`${API_BASE}/movies/upload`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Failed to create movie');
      setTitle('');
      setDescription('');
      setDuration('');
      setFile(null);
      await fetchMovies();
      onCreated && onCreated();
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="manage" className="relative w-full bg-white py-10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12">
        <h2 className="mb-6 text-2xl font-bold">Add a Movie</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" placeholder="Movie title" />
          </div>
          <div className="col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" placeholder="e.g. 120" />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" placeholder="Short synopsis"></textarea>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Poster (upload from gallery)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700" />
          </div>
          {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
          <div className="col-span-2 flex items-center gap-3">
            <button disabled={loading} className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Movie'}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold">Current Movies</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {movies.map((m) => (
              <div key={m.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {m.poster_image ? (
                  <img src={m.poster_image} alt={m.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-sm text-gray-500">No poster</div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold">{m.title}</h4>
                  {m.duration_minutes && (
                    <p className="text-xs text-gray-500">{m.duration_minutes} min</p>
                  )}
                </div>
              </div>
            ))}
            {movies.length === 0 && (
              <p className="text-sm text-gray-500">No movies yet. Add your first movie above.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
