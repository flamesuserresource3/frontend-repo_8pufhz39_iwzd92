import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zks9uYILDPSX-UX6/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Soft gradient edges so content is legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 sm:px-8 md:px-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-medium backdrop-blur-md">
          Futuristic Ticketing
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
          Live Bookings
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Holographic Theater Booking
        </h1>
        <p className="max-w-2xl text-base text-white/80 sm:text-lg">
          Upload your posters, set theaters and showtimes, and let guests book instantly. Powered by a modern stack and a cinematic 3D hero.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#manage" className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
            Manage Movies & Shows
          </a>
          <a href="#book" className="rounded-md border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
            Book Tickets
          </a>
        </div>
      </div>
    </section>
  );
}
