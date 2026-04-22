import { NavLink } from "react-router";
import { FaLeaf, FaTimes, FaBars } from "react-icons/fa";
import { useState } from "react";
import { useAppContext } from "~/context/AppContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAppContext();
  const base = "transition hover:text-green-300";
  const active = "text-green-300 font-semibold";
  const authLabel = currentUser ? "Dashboard" : "Log In";
  const authTarget = currentUser ? "/dashboard" : "/login";

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-base sm:text-lg font-semibold text-green-300"
        >
          <FaLeaf className="text-green-400 text-lg" />
          <span>Smart Season Field Monitoring</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-6">
          <div className="space-x-4 text-sm text-slate-200">
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/about"
            >
              About
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/contact"
            >
              Contact Us
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? active : base)} to={authTarget}>
              {authLabel}
            </NavLink>
            {currentUser && (
              <button
                className="text-sm text-red-300 hover:text-red-200 transition cursor-pointer"
                onClick={logout}
                type="button"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
        {/* Hambugger Menu */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-200 text-xl cursor-pointer"
            title="Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 space-y-2 text-center">
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to="/"
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to="/about"
            onClick={closeMenu}
          >
            About
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to="/contact"
            onClick={closeMenu}
          >
            Contact Us
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to={authTarget}
            onClick={closeMenu}
          >
            {authLabel}
          </NavLink>
          {currentUser && (
            <button
              className="text-red-300 hover:text-red-200 transition cursor-pointer"
              onClick={() => {
                logout();
                closeMenu();
              }}
              type="button"
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
