// src/pages/authority/Departments.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoriesHandled: [],
    email: "",
    phone: "",
  });

  const categoryOptions = [
    "Road",
    "Water",
    "Electricity",
    "Sanitation",
    "Street Light",
    "Other",
  ];

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data.departments || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load departments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle category checkbox selection
  const handleCategoryChange = (category) => {
    setFormData((prev) => {
      if (prev.categoriesHandled.includes(category)) {
        return {
          ...prev,
          categoriesHandled:
            prev.categoriesHandled.filter(
              (item) => item !== category
            ),
        };
      }

      return {
        ...prev,
        categoriesHandled: [
          ...prev.categoriesHandled,
          category,
        ],
      };
    });
  };

  // Create new department
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("/departments", formData);

      // Reset form
      setFormData({
        name: "",
        description: "",
        categoriesHandled: [],
        email: "",
        phone: "",
      });

      // Refresh list
      fetchDepartments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create department"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete department
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete department"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading departments...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-semibold mb-4">
            Authority Portal
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Manage Departments
          </h1>

          <p className="text-slate-300 text-lg">
            Create and manage government departments.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Create Department Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Create New Department
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Department Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />

            {/* Description */}
            <textarea
              name="description"
              rows="4"
              placeholder="Department Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />

            {/* Categories Handled */}
            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Categories Handled
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryOptions.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 text-slate-300 bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoriesHandled.includes(
                        category
                      )}
                      onChange={() =>
                        handleCategoryChange(category)
                      }
                      className="w-4 h-4 accent-violet-500"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>

              {formData.categoriesHandled.length > 0 && (
                <p className="mt-2 text-violet-300 text-sm">
                  Selected:{" "}
                  {formData.categoriesHandled.join(", ")}
                </p>
              )}
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Department Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                saving ||
                formData.categoriesHandled.length === 0
              }
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-semibold text-lg shadow-lg transition duration-300 disabled:opacity-50"
            >
              {saving
                ? "Creating Department..."
                : "Create Department"}
            </button>
          </form>
        </div>

        {/* Department List */}
        <div className="grid md:grid-cols-2 gap-6">
          {departments.map((department) => (
            <div
              key={department._id}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {department.name}
              </h3>

              <p className="text-slate-300 mb-4">
                {department.description}
              </p>

              <p className="text-slate-400 text-sm mb-2">
                Email: {department.email}
              </p>

              <p className="text-slate-400 text-sm mb-2">
                Phone: {department.phone}
              </p>

              <p className="text-violet-300 text-sm mb-4">
                Categories:{" "}
                {department.categoriesHandled?.join(
                  ", "
                )}
              </p>

              <button
                onClick={() =>
                  handleDelete(department._id)
                }
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Departments;