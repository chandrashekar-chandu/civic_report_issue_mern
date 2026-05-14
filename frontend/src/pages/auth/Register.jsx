import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "citizen",
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
    setLoading(true);

    try {
      const data = await register(formData);
      const role = data.user.role;

      if (role === "authority") {
        navigate("/authority");
      } else if (role === "department") {
        navigate("/department");
      } else {
        navigate("/citizen");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* Left Hero Section */}
        <div className="hidden lg:flex flex-col justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-white shadow-2xl">
          <span className="inline-block w-fit px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-semibold mb-6">
            Join the Civic Network
          </span>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Create Your Account
          </h1>

          <p className="text-slate-300 text-lg leading-8">
            Citizens can report issues, departments can resolve them,
            and authorities can monitor the complete workflow.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <span>Simple complaint submission</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-teal-400"></span>
              <span>Secure role-based access</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span>
              <span>Transparent issue tracking</span>
            </div>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Register
          </h2>
          <p className="text-slate-300 mb-8">
            Create your account to get started.
          </p>

          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="citizen">Citizen</option>
              <option value="department">Department</option>
              <option value="authority">Authority</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg transition duration-300"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-slate-300 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-300 hover:text-cyan-200 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;