import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = formData.email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const data = await login({
        email: cleanEmail,
        password: formData.password,
      });
      const role = data.user.role;

      if (role === "authority") {
        navigate("/authority");
      } else if (role === "department") {
        navigate("/department");
      } else {
        navigate("/citizen");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Glowing background shapes */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Hero Feature Showcase */}
        <div className="hidden lg:flex flex-col justify-between glass-panel rounded-3xl p-12 text-white shadow-2xl min-h-[540px] border border-white/10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full blur-2xl" />

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-emerald-300">
                  CP
                </div>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">CivicPulse</span>
                <p className="text-xs text-slate-400 font-medium">Smart Municipal Portal</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Enterprise Governance Suite
            </span>

            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Empowering Cities Through Technology
            </h1>

            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Seamlessly connect citizens, municipal authorities, and specialized departments to resolve infrastructure issues with real-time updates.
            </p>

            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-extrabold text-cyan-400">100%</div>
                <div className="text-xs text-slate-400 font-medium">Transparent</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-extrabold text-emerald-400">Real-Time</div>
                <div className="text-xs text-slate-400 font-medium">Tracking</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-extrabold text-purple-400">Multi-Role</div>
                <div className="text-xs text-slate-400 font-medium">Access</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4 mt-6">
            <span>Security Encrypted 256-bit</span>
            <span>Civic Pulse Platform © 2026</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10 relative">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm">
              Enter your credentials to access your portal.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 transition"
              >
                Register Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;