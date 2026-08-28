import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case "authority":
        return { label: "Authority Portal", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
      case "department":
        return { label: "Department Portal", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
      default:
        return { label: "Citizen Portal", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" };
    }
  };

  const badge = getRoleBadge();

  const getNavLinks = () => {
    if (user.role === "authority") {
      return [
        { label: "Dashboard", path: "/authority" },
        { label: "All Issues", path: "/authority/issues" },
        { label: "Departments", path: "/authority/departments" },
        { label: "Analytics", path: "/authority/analytics" },
      ];
    }
    if (user.role === "department") {
      return [
        { label: "Dashboard", path: "/department" },
        { label: "Assigned Issues", path: "/department/issues" },
      ];
    }
    return [
      { label: "Dashboard", path: "/citizen" },
      { label: "My Issues", path: "/citizen/issues" },
      { label: "Report Issue", path: "/citizen/create-issue" },
      { label: "Notifications", path: "/citizen/notifications" },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-emerald-300">
              CP
            </div>
          </div>

          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              CivicPulse <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">v2.0</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-white border border-cyan-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-white leading-tight">
              {user.name}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.color} mt-0.5`}>
              {badge.label}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition duration-200 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
