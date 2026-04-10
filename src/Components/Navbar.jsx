import { AppBar, Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpenDropdown(false);
    navigate("/");
  };

  const userNavLinks = [
    { to: "/", label: "Destinations" },
    { to: "/hotel", label: "Hotels" },
    { to: "/experiences", label: "Experiences" },
    { to: "/offers", label: "Offers" },
    { to: "/membership", label: "Memberships" },
    { to: "/contact", label: "Contact" },
  ];

  const adminNavLinks = [
    { to: "/admin?tab=dashboard", label: "Dashboard" },
    { to: "/admin?tab=hotels", label: "Manage Hotels" },
    { to: "/admin?tab=bookings", label: "Bookings" },
  ];

  const navLinks = user?.role === "admin" ? adminNavLinks : userNavLinks;

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 2 : 0}
      sx={{
        backgroundColor: scrolled ? "#C9A24D" : "transparent",
        color: scrolled ? "#ffffff" : "#1f2937",
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar className="flex justify-between px-6 md:px-10 py-3">
        {/* LOGO */}
        <Link
          to="/"
          className={`text-2xl font-serif ${scrolled ? "text-white" : "text-[#8B6B2E]"}`}
        >
          Aurevia Grand
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex gap-8 text-sm font-medium tracking-wide">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={`hover:opacity-70 transition-all ${scrolled ? 'text-white' : 'text-gray-800'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 items-center">
          {!user && (
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => navigate("/login")}
                className={`text-sm font-semibold px-5 py-2 rounded-full border-2 transition-all ${
                  scrolled
                    ? "border-white text-white hover:bg-white hover:text-[#C9A24D]"
                    : "border-[#C9A24D] text-[#8B6B2E] hover:bg-[#C9A24D] hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className={`text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-md hover:shadow-lg ${
                  scrolled
                    ? "bg-white text-[#C9A24D] hover:bg-yellow-50"
                    : "bg-[#C9A24D] text-white hover:bg-[#b8913f]"
                }`}
              >
                Register
              </button>
            </div>
          )}

          {user?.role === "user" && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="font-medium hover:text-[#C9A24D] transition flex items-center gap-1"
              >
                Hello, {user.firstName}
                <span className="text-xs">{openDropdown ? "▲" : "▼"}</span>
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-3 w-52 bg-white shadow-2xl rounded-2xl py-2 z-50 text-gray-700 border border-gray-100">
                  <button
                    onClick={() => { navigate("/hotel"); setOpenDropdown(false); }}
                    className="block w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition"
                  >
                    🏨 Book a Stay
                  </button>
                  <button
                    onClick={() => { navigate("/my-bookings"); setOpenDropdown(false); }}
                    className="block w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition"
                  >
                    📋 My Bookings
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {user?.role === "admin" && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                Admin
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:text-red-500 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
