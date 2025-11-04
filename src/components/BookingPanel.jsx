import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function BookingPanel() {
  const [showtimes, setShowtimes] = useState([]);
  const [selected, setSelected] = useState('');
  const [name, setName] = useState('');
  const [seats, setSeats] = useState('1');
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await fetch(`${API_BASE}/showtimes`);
    setShowtimes(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showtime_id: selected,
          customer_name: name,
          seats: parseInt(seats || '0', 10),
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to book');
      }
      setName('');
      setSeats('1');
      setSelected('');
      setMessage('Booking confirmed! Enjoy the show.');
      await load();
    } catch (e) {
      setMessage(e.message || 'Error while booking');
    }
  };

  return (
    <section id="book" className="w-full bg-white py-10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12">
        <h2 className="mb-6 text-2xl font-bold">Book Tickets</h2>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Showtime</label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring">
              <option value="">Select showtime</option>
              {showtimes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.movie_title} • {s.theater_name} • {new Date(s.start_time).toLocaleString()} ({s.seats_available} left)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" placeholder="e.g. Alex Doe" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Seats</label>
            <input type="number" min={1} value={seats} onChange={(e) => setSeats(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-emerald-500/30 focus:ring" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <button className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Confirm Booking</button>
          </div>
        </form>
        {message && (
          <p className="mt-3 text-sm text-emerald-700">{message}</p>
        )}

        <div className="mt-8">
          <h3 className="mb-2 text-lg font-semibold">All Showtimes</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {showtimes.map((s) => (
              <div key={s.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="font-semibold">{s.movie_title}</p>
                <p className="text-sm text-gray-600">{s.theater_name} • {s.theater_location}</p>
                <p className="text-sm text-gray-600">{new Date(s.start_time).toLocaleString()}</p>
                <p className="mt-1 text-xs text-gray-500">Seats left: {s.seats_available}/{s.total_seats}</p>
              </div>
            ))}
            {showtimes.length === 0 && (
              <p className="text-sm text-gray-500">No scheduled shows yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
