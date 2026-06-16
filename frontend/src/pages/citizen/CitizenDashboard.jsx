import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CitizenDashboard = () => {
  const { user, logout } = useAuth();

  const actions = [
    {
      icon: "📢",
      title: "Report New Issue",
      description:
        "Submit complaints about roads, sanitation, street lights, and other civic issues.",
      path: "/citizen/create-issue",
    },
    {
      icon: "📋",
      title: "My Complaints",
      description:
        "View all submitted issues and track their current status.",
      path: "/citizen/issues",
    },
    {
      icon: "🔔",
      title: "Notifications",
      description:
        "Check updates, comments, and alerts related to your issues.",
      path: "/citizen/notifications",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-semibold mb-4">
                Citizen Portal
              </span>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Welcome, {user?.name}
              </h1>

              <p className="text-slate-300 text-lg">
                Report civic issues, monitor progress, and track resolutions in
                real time.
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

        {/* User Info */}
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
            <p className="text-2xl font-bold text-cyan-300 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 hover:scale-105 hover:bg-white/15 transition duration-300"
            >
              <div className="text-4xl mb-4">{action.icon}</div>

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

export default CitizenDashboard;