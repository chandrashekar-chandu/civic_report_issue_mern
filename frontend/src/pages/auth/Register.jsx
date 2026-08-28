import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "citizen",
    departmentId: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch departments when role is department
  useEffect(() => {
    const fetchDepartments = async () => {
      if (formData.role !== "department") {
        setDepartments([]);
        return;
      }

      try {
        setLoadingDepartments(true);
        const response = await api.get("/departments");
        const data =
          response.data.departments ||
          response.data.data ||
          response.data ||
          [];

        setDepartments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load departments:", error);
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && value !== "department"
        ? { departmentId: "" }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, "");

    if (!cleanName || cleanName.length < 2) {
      setError("Please enter a valid full name (at least 2 characters).");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    if (!cleanPhone) {
      setError("Please enter your phone number.");
      return;
    }

    if (!phoneRegex.test(cleanPhone)) {
      setError("Please enter a valid phone number (10 to 15 digits).");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.role === "department" && !formData.departmentId) {
      setError("Please select a department for department accounts.");
      return;
    }

    setLoading(true);

    try {
      await register({
        ...formData,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
      });
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="glass-panel rounded-3xl shadow-2xl p-8 md:p-10 border border-white/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/30 mb-4">
              <div className="w-full h-full bg-slate-950 rounded-[12px] flex items-center justify-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-emerald-300">
                CP
              </div>
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Create Your Account
            </h1>

            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Join CivicPulse to report civic issues or manage municipal department works.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
              />
            </div>

            {/* Phone & Password Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 234 567 890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
                />
              </div>
            </div>

            {/* Account Role Choice */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Account Type
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "citizen", label: "Citizen", icon: "👤" },
                  { id: "department", label: "Department", icon: "🏢" },
                  { id: "authority", label: "Authority", icon: "🛡️" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      handleChange({ target: { name: "role", value: item.id } })
                    }
                    className={`py-3 px-2 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                      formData.role === item.id
                        ? "bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-md shadow-cyan-500/10"
                        : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Department Dropdown */}
            {formData.role === "department" && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1.5">
                  Assign Department
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition text-sm font-semibold"
                >
                  <option value="">
                    {loadingDepartments
                      ? "Loading departments..."
                      : "-- Choose Your Department --"}
                  </option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;