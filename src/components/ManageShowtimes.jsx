import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ManageShowtimes() {
  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  // Theater form
  const [tName, setTName] = useState('');
  const [tLocation, setTLocation] = useState('');

  // Showtime form
  const [movieId, setMovieId] = useState('');
  const [theaterId, setTheaterId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [totalSeats, setTotalSeats] = useState('100');

  const loadAll = async () => {
    const [mRes, tRes, sRes] = await Promise.all([
      fetch(`${API_BASE}/movies`),
      fetch(`${API_BASE}/theaters`),
      fetch(`${API_BASE}/showtimes`),
    ]);
    setMovies(await mRes.json());
    setTheaters(await tRes.json());
    setShowtimes(await sRes.json());
  };

  useEffect(() => {
    loadAll();
  }, []);

  const createTheater = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/theaters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tName, location: tLocation }),
    });
    setTName('');
    setTLocation('');
    await loadAll();
  };

  const createShowtime = async (e) => {
    e.preventDefault();
    if (!movieId || !theaterId || !startTime) return;
    const iso = new Date(startTime).toISOString();
    await fetch(`${API_BASE}/showtimes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movie_id: movieId,
        theater_id: theaterId,
        start_time: iso,
        total_seats: parseInt(totalSeats || '0', 10),
      }),
    });
    setMovieId('');
    setTheaterId('');
    setStartTime('');
    setTotalSeats('100');
    await loadAll();
  };

  return (
    <section className="w-full bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12">
        <h2 className="mb-6 text-2xl font-bold">Manage Theaters & Showtimes</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form onSubmit={createTheater} className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 font-semibold">Create Theater</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input value={tName} onChange={(e) => setTName(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" placeholder="e.g. Galaxy Cinema Hall" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
                <input value={tLocation} onChange={(e) => setTLocation(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" placeholder="City or address" />
              </div>
              <div>
                <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Save Theater</button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Existing Theaters</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {theaters.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-3 py-2">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-gray-500">{t.location}</span>
                  </li>
                ))}
                {theaters.length === 0 && <li className="text-gray-500">No theaters yet.</li>}
              </ul>
            </div>
          </form>

          <form onSubmit={createShowtime} className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 font-semibold">Create Showtime</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Movie</label>
                <select value={movieId} onChange={(e) => setMovieId(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring">
                  <option value="">Select a movie</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Theater</label>
                <select value={theaterId} onChange={(e) => setTheaterId(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring">
                  <option value="">Select a theater</option>
                  {theaters.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} • {t.location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Start time</label>
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Total seats</label>
                <input type="number" min={1} value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" />
              </div>
              <div>
                <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Save Showtime</button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Upcoming Showtimes</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {showtimes.map((s) => (
                  <li key={s.id} className="rounded border border-gray-100 bg-gray-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">{s.movie_title || 'Movie'} → {s.theater_name || 'Theater'}</p>
                        <p className="text-gray-500">{new Date(s.start_time).toLocaleString()} • {s.theater_location}</p>
                      </div>
                      <div className="text-xs text-gray-600">Seats: {s.seats_available}/{s.total_seats}</div>
                    </div>
                  </li>
                ))}
                {showtimes.length === 0 && <li className="text-gray-500">No showtimes yet.</li>}
              </ul>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
