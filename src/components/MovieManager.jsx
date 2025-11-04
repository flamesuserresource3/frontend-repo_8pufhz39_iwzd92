import { useEffect, useState } from 'react'

export default function MovieManager({ onChange }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [image, setImage] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  const BASE = import.meta.env.VITE_BACKEND_URL

  async function fetchMovies() {
    try {
      const res = await fetch(`${BASE}/movies`)
      const data = await res.json()
      setMovies(data)
      onChange?.()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchMovies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', title)
      if (description) fd.append('description', description)
      if (duration) fd.append('duration_minutes', duration)
      if (image) fd.append('image', image)

      const res = await fetch(`${BASE}/movies/upload`, {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error('Failed to create movie')
      setTitle('')
      setDescription('')
      setDuration('')
      setImage(null)
      await fetchMovies()
    } catch (err) {
      console.error(err)
      alert('Error creating movie')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto mt-10 max-w-6xl px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-xl border bg-white/70 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">Add a Movie</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input value={title} onChange={(e)=>setTitle(e.target.value)} required className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Movie title" />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Short synopsis" />
            </div>
            <div>
              <label className="block text-sm font-medium">Duration (min)</label>
              <input type="number" min="1" value={duration} onChange={(e)=>setDuration(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="120" />
            </div>
            <div>
              <label className="block text-sm font-medium">Poster image</label>
              <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0]||null)} className="mt-1 w-full" />
            </div>
            <button disabled={loading} className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Movie'}
            </button>
          </div>
        </form>
        <div className="rounded-xl border bg-white/70 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold">Current Movies</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {movies.map(m => (
              <div key={m.id} className="overflow-hidden rounded-lg border">
                {m.poster_image ? (
                  <img src={m.poster_image} alt={m.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-gray-100 text-gray-500">No poster</div>
                )}
                <div className="p-3">
                  <div className="font-semibold">{m.title}</div>
                  {m.duration_minutes ? (
                    <div className="text-sm text-gray-600">{m.duration_minutes} min</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
