import { useState } from 'react';
import { NavLink, Link } from 'react-router';
import { Search, Menu, X, Globe } from 'lucide-react';

const navLinks = [
  { name: 'Sākums', path: '/' },
  { name: 'Radars', path: '/radars' },
  { name: 'Satelīts', path: '/satelits' },
  { name: 'Karte', path: '/karte' },
  { name: 'Prognoze', path: '/prognoze' },
  { name: 'Brīdinājumi', path: '/bridinajumi' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Par', path: '/par' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-full.png" alt="MeteoLatvia" className="h-8 md:h-10 object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-secondary ${
                  isActive ? 'text-secondary' : 'text-medium-emphasis'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Actions: Search & Lang */}
        <div className="hidden md:flex items-center gap-5">
          <button className="text-medium-emphasis hover:text-secondary transition-colors" aria-label="Meklēt">
            <Search size={20} />
          </button>
          <button className="flex items-center gap-1.5 text-medium-emphasis hover:text-high-emphasis transition-colors text-sm font-medium">
            <Globe size={16} />
            <span>LV</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-high-emphasis p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Izvēlne"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col py-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-base font-medium border-l-4 transition-colors ${
                    isActive
                      ? 'border-secondary text-secondary bg-landmass/30'
                      : 'border-transparent text-medium-emphasis hover:bg-landmass hover:text-high-emphasis'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}