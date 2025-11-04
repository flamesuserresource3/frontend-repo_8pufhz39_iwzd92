import { useEffect, useState } from 'react'

export default function ShowtimeManager({ onChange }) {
  const BASE = import.meta.env.VITE_BACKEND_URL
  const [movies, setMovies] = useState([])
  const [theaters, setTheaters] = useState([])

  const [movieId, setMovieId] = useState('')
  const [theaterId, setTheaterId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [totalSeats, setTotalSeats] = useState(50)
  const [loading, setLoading] = useState(false)

  // New theater fields
  const [newTheater, setNewTheater] = useState({ name: '', location: '' })

  async function loadData() {
    try {
      const [mRes, tRes] = await Promise.all([
        fetch(`${BASE}/movies`),
        fetch(`${BASE}/theaters`),
      ])
      const [mData, tData] = await Promise.all([mRes.json(), tRes.json()])
      setMovies(mData)
      setTheaters(tData)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addTheater(e) {
    e.preventDefault()
    if (!newTheater.name || !newTheater.location) return
    try {
      const res = await fetch(`${BASE}/theaters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTheater),
      })
      const data = await res.json()
      if (res.ok) {
        setTheaters(prev => [...prev, { id: data.id, ...newTheater }])
        setNewTheater({ name: '', location: '' })
      } else {
        throw new Error('Failed to add theater')
      }
    } catch (err) {
      console.error(err)
      alert('Error adding theater')
    }
  }

  async function addShowtime(e) {
    e.preventDefault()
    if (!movieId || !theaterId || !startTime) return
    setLoading(true)
    try {
      const payload = {
        movie_id: movieId,
        theater_id: theaterId,
        start_time: new Date(startTime).toISOString(),
        total_seats: Number(totalSeats),
      }
      const res = await fetch(`${BASE}/showtimes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add showtime')
      setMovieId('')
      setTheaterId('')
      setStartTime('')
      setTotalSeats(50)
      onChange?.()
    } catch (err) {
      console.error(err)
      alert('Error creating showtime')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto mt-8 max-w-6xl px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={addShowtime} className="rounded-xl border bg-white/70 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">Create a Showtime</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="block text-sm font-medium">Movie</label>
              <select value={movieId} onChange={(e)=>setMovieId(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2">
                <option value="">Select a movie</option>
                {movies.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Theater</label>
              <select value={theaterId} onChange={(e)=>setTheaterId(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2">
                <option value="">Select a theater</option>
                {theaters.map(t => (
                  <option key={t.id} value={t.id}>{t.name} — {t.location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Start time</label>
              <input type="datetime-local" value={startTime} onChange={(e)=>setStartTime(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Total seats</label>
              <input type="number" min="1" value={totalSeats} onChange={(e)=>setTotalSeats(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
            <button disabled={loading} className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60">{loading? 'Saving...' : 'Save Showtime'}</button>
          </div>
        </form>
        <form onSubmit={addTheater} className="rounded-xl border bg-white/70 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">Quick Add Theater</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input value={newTheater.name} onChange={(e)=>setNewTheater(v=>({ ...v, name: e.target.value }))} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Auditorium A" />
            </div>
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input value={newTheater.location} onChange={(e)=>setNewTheater(v=>({ ...v, location: e.target.value }))} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Downtown" />
            </div>
            <button className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700">Add Theater</button>
          </div>
        </form>
      </div>
    </section>
  )
}
