import { Outlet } from 'react-router';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-high-emphasis font-sans flex flex-col">
      <Header />
      
      {/* Outlet is where React Router injects the current page (Home, Map, etc.) */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border py-8 mt-auto bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-low-emphasis">
            <img src="/logo-icon.png" alt="MeteoLatvia Icon" className="h-6 w-6 opacity-50 grayscale" />
            <span className="text-sm font-light">&copy; {new Date().getFullYear()} MeteoLatvia.</span>
          </div>
          <div className="text-xs text-low-emphasis font-thin">
            Dati: Open-Meteo (Nākotnē: LVĢMC)
          </div>
        </div>
      </footer>
    </div>
  );
}