import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] =
    useState(false);

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

        // Handle different response shapes
        const data =
          response.data.departments ||
          response.data.data ||
          response.data ||
          [];

        setDepartments(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to load departments:",
          error
        );
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
      // Reset department if role changes
      ...(name === "role" &&
      value !== "department"
        ? { departmentId: "" }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Validation for department users
      if (
        formData.role === "department" &&
        !formData.departmentId
      ) {
        setError(
          "Please select a department."
        );
        setLoading(false);
        return;
      }

      await register(formData);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Create Account
        </h1>

        <p className="text-slate-300 text-center mb-8">
          Register to access the Civic Issue Reporting System
        </p>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />

          {/* Role */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="citizen">
              Citizen
            </option>
            <option value="department">
              Department
            </option>
            <option value="authority">
              Authority
            </option>
          </select>

          {/* Department Dropdown */}
          {formData.role === "department" && (
            <select
              name="departmentId"
              value={
                formData.departmentId
              }
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/40 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">
                {loadingDepartments
                  ? "Loading departments..."
                  : "Select Department"}
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={department._id}
                    value={
                      department._id
                    }
                  >
                    {department.name}
                  </option>
                )
              )}
            </select>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-semibold shadow-lg transition duration-300"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <p className="text-slate-300 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;