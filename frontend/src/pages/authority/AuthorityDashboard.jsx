// src/pages/authority/AuthorityDashboard.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthorityDashboard = () => {
  const { user, logout } = useAuth();

  const quickActions = [
    {
      icon: "📋",
      title: "View All Issues",
      description:
        "Monitor every civic issue reported across the system.",
      accent: "from-cyan-500 to-blue-600",
      path: "/authority/issues",
    },
    {
      icon: "🏢",
      title: "Manage Departments",
      description:
        "Create, update, and organize government departments.",
      accent: "from-purple-500 to-indigo-600",
      path: "/authority/departments",
    },
    {
      icon: "📊",
      title: "Analytics",
      description:
        "Track trends, priorities, and issue resolution metrics.",
      accent: "from-orange-500 to-amber-500",
      path: "/authority/analytics",
    },
    {
      icon: "🎯",
      title: "Assign Departments",
      description:
        "Route issues to the appropriate responsible department.",
      accent: "from-emerald-500 to-green-600",
      // Assignment is done from the "View All Issues" page,
      // so we navigate there.
      path: "/authority/issues",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-semibold mb-4">
                Authority Portal
              </span>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Welcome, {user?.name}
              </h1>

              <p className="text-slate-300 text-lg">
                Oversee departments, assign issues, and monitor city-wide
                performance.
              </p>
            </div>

            <button
              onClick={logout}
              className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">
              Full Name
            </p>
            <p className="text-2xl font-bold text-white">{user?.name}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">
              Email Address
            </p>
            <p className="text-xl font-semibold text-white break-all">
              {user?.email}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">
              User Role
            </p>
            <p className="text-2xl font-bold text-violet-300 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 hover:scale-105 hover:bg-white/15 transition duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${action.accent} flex items-center justify-center text-3xl mb-4 shadow-lg`}
              >
                {action.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {action.title}
              </h3>

              <p className="text-slate-300 leading-7">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;