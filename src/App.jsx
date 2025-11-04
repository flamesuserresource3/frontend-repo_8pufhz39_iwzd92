import Hero from './components/Hero';
import MovieForm from './components/MovieForm';
import ManageShowtimes from './components/ManageShowtimes';
import BookingPanel from './components/BookingPanel';

function App() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <Hero />
      <MovieForm />
      <ManageShowtimes />
      <BookingPanel />
      <footer className="border-t border-gray-200 bg-white/80 py-8 text-center text-sm text-gray-600">
        Built for immersive, futuristic ticketing.
      </footer>
    </div>
  );
}

export default App;
