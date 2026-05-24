import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-emerald-700' : 'text-slate-600 hover:text-emerald-600'
  }`;

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-emerald-700">
          NYC Hidden Spots
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/spots" className={linkClass}>
            Browse Spots
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/spots/new" className={linkClass}>
                Create Spot
              </NavLink>
              <NavLink to="/saved" className={linkClass}>
                Saved Spots
              </NavLink>
              <span className="hidden text-sm text-slate-500 sm:inline">
                Hi, {user?.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
