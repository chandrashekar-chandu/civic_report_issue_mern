import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 max-w-lg w-full glass-panel rounded-3xl shadow-2xl p-10 text-center border border-white/10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-6xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent mb-2 tracking-tight">
          403 Access Denied
        </h1>

        <h2 className="text-2xl font-extrabold text-white mb-3">
          Unauthorized Access
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          You do not have permission to view this resource. Please log in with an authorized role account.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition duration-300"
        >
          <span>Return to Login</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;