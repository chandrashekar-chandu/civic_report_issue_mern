import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

const AuthorityDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: "📋",
      title: "View All Issues",
      description: "Monitor every reported civic issue system-wide and oversee assignment statuses.",
      accent: "from-cyan-500 to-blue-600",
      path: "/authority/issues",
    },
    {
      icon: "🏢",
      title: "Manage Departments",
      description: "Create municipal departments, set handled categories, and assign department officers.",
      accent: "from-purple-500 to-indigo-600",
      path: "/authority/departments",
    },
    {
      icon: "📊",
      title: "Analytics Hub",
      description: "Analyze city-wide issue trends, category distributions, and resolution statistics.",
      accent: "from-amber-500 to-orange-600",
      path: "/authority/analytics",
    },
    {
      icon: "🎯",
      title: "Route & Assign",
      description: "Assign unallocated complaints directly to specialized municipal departments.",
      accent: "from-emerald-500 to-teal-600",
      path: "/authority/issues",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Command Center Banner */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              Municipal Command Center
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
              Welcome, <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">{user?.name}</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Oversee city-wide department operations, route citizen complaints, and monitor municipal metrics.
            </p>
          </div>
        </div>

        {/* Profile Information Widgets */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-black">
              🛡️
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Authority Officer</p>
              <p className="text-xl font-bold text-white mt-0.5">{user?.name}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-black">
              ✉️
            </div>
            <div className="overflow-hidden">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Official Email</p>
              <p className="text-base font-semibold text-white truncate mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl font-black">
              👑
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Admin Level</p>
              <p className="text-xl font-bold text-purple-300 capitalize mt-0.5">Municipal Authority</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-6 tracking-tight">
            Authority Command Modules
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="glass-card glass-card-hover rounded-3xl p-8 border border-white/10 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${action.accent} flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition duration-300`}
                  >
                    {action.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition">
                    {action.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {action.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-purple-400 group-hover:translate-x-1 transition duration-200">
                  <span>Open Module</span>
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

export default AuthorityDashboard;