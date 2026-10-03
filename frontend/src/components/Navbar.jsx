import { useState } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold tracking-tight text-white">
          TechBlog
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-slate-300 transition hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            className="rounded-full border border-indigo-500 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/10"
          >
            Admin
          </Link>
        </nav>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-indigo-500 hover:text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="text-xl">{open ? '×' : '☰'}</span>
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-300 transition hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="rounded-full border border-indigo-500 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/10"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
