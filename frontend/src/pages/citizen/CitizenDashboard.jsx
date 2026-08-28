import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

const CitizenDashboard = () => {
  const { user } = useAuth();

  const actions = [
    {
      icon: "📢",
      title: "Report New Issue",
      description: "Submit complaints about roads, sanitation, street lights, and civic infrastructure.",
      path: "/citizen/create-issue",
      color: "from-cyan-500/20 to-teal-500/20 text-cyan-300 border-cyan-500/30",
    },
    {
      icon: "📋",
      title: "My Complaints",
      description: "View all your reported issues, check progress, and track resolution timelines.",
      path: "/citizen/issues",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      icon: "🔔",
      title: "Notifications",
      description: "Check status updates, department assignments, and resolution progress.",
      path: "/citizen/notifications",
      color: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Welcome Header */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Citizen Empowerment Portal
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
              Welcome Back, <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">{user?.name}</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Report municipal issues, track department resolution progress, and ensure a cleaner, safer city environment.
            </p>
          </div>
        </div>

        {/* User Account Info Widgets */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-black">
              👤
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Account Name</p>
              <p className="text-xl font-bold text-white mt-0.5">{user?.name}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-black">
              ✉️
            </div>
            <div className="overflow-hidden">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Email Address</p>
              <p className="text-base font-semibold text-white truncate mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-black">
              🛡️
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Role Access</p>
              <p className="text-xl font-bold text-cyan-300 capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-6 tracking-tight flex items-center gap-2">
            <span>Quick Actions</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {actions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="glass-card glass-card-hover rounded-3xl p-8 border border-white/10 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition duration-300 shadow-lg">
                    {action.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition">
                    {action.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {action.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition duration-200">
                  <span>Open Section</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;