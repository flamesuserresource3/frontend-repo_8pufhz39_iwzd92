import { useEffect, useMemo, useState } from 'react'

export default function Listings() {
  const BASE = import.meta.env.VITE_BACKEND_URL
  const [showtimes, setShowtimes] = useState([])
  const [moviesById, setMoviesById] = useState({})
  const [loading, setLoading] = useState(true)

  const [booking, setBooking] = useState({}) // keyed by showtime id -> { name, seats }

  async function load() {
    setLoading(true)
    try {
      const [stRes, mRes] = await Promise.all([
        fetch(`${BASE}/showtimes`),
        fetch(`${BASE}/movies`),
      ])
      const [stData, mData] = await Promise.all([stRes.json(), mRes.json()])
      setShowtimes(stData)
      const map = {}
      for (const m of mData) map[m.id] = m
      setMoviesById(map)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function submitBooking(id) {
    const data = booking[id]
    if (!data?.name || !data?.seats) return alert('Enter name and seats')
    try {
      const res = await fetch(`${BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showtime_id: id, customer_name: data.name, seats: Number(data.seats) }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t)
      }
      await load()
      setBooking(b => ({ ...b, [id]: { name: '', seats: '' } }))
      alert('Booking confirmed!')
    } catch (e) {
      console.error(e)
      alert('Booking failed')
    }
  }

  const grouped = useMemo(() => {
    // Group by date for nicer layout
    const map = new Map()
    for (const st of showtimes) {
      const d = new Date(st.start_time)
      const key = d.toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(st)
    }
    return Array.from(map.entries())
  }, [showtimes])

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-10">Loading showtimes...</div>

  return (
    <section className="mx-auto my-10 max-w-6xl px-6">
      <h2 className="mb-4 text-2xl font-bold">Available Showtimes</h2>
      {grouped.length === 0 && (
        <div className="rounded-md border bg-white/70 p-6">No showtimes yet. Add one above.</div>
      )}
      <div className="space-y-8">
        {grouped.map(([date, items]) => (
          <div key={date}>
            <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">{date}</div>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map(st => {
                const m = moviesById[st.movie_id]
                return (
                  <div key={st.id} className="overflow-hidden rounded-xl border bg-white/80 backdrop-blur">
                    <div className="grid grid-cols-3 gap-0">
                      <div className="col-span-1">
                        {m?.poster_image ? (
                          <img src={m.poster_image} alt={m?.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">No poster</div>
                        )}
                      </div>
                      <div className="col-span-2 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-lg font-semibold">{m?.title || 'Unknown Movie'}</div>
                            <div className="text-sm text-gray-600">{st.theater_name} • {st.theater_location}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">{new Date(st.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="text-xs text-gray-600">Seats left: {st.seats_available}</div>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                          <input
                            placeholder="Your name"
                            className="rounded-md border px-3 py-2"
                            value={booking[st.id]?.name || ''}
                            onChange={(e)=>setBooking(b=>({ ...b, [st.id]: { ...(b[st.id]||{}), name: e.target.value } }))}
                          />
                          <input
                            type="number"
                            min="1"
                            placeholder="Seats"
                            className="rounded-md border px-3 py-2"
                            value={booking[st.id]?.seats || ''}
                            onChange={(e)=>setBooking(b=>({ ...b, [st.id]: { ...(b[st.id]||{}), seats: e.target.value } }))}
                          />
                          <button onClick={()=>submitBooking(st.id)} className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">Book</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
