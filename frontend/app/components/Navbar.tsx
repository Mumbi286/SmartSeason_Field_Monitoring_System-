import { NavLink } from "react-router";
import { FaLeaf, FaTimes, FaBars } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const base = "transition hover:text-black";
  const active = "text-green-400 font-semibold";
  return (
    <nav className="bg-green-800 border-b border-green-950 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-green-300"
        >
          <FaLeaf className="text-green-400 text-xl" />
          <span>Smart Season Field Monitoring System</span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="space-x-4 text-sm text-shadow-white">
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
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/login"
            >
              Log In
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? active : base)}
              to="/signup"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
        {/* Hambugger Menu */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-green-400 text-xl cursor-pointer"
            title="Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-green-700 border-t border-green-700 px-6 py-4 space-y-2 space-x-4 text-center">
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            Log In
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? active : base)}
            to="/signup"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
