import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

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

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data.departments || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load departments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => {
      if (prev.categoriesHandled.includes(category)) {
        return {
          ...prev,
          categoriesHandled: prev.categoriesHandled.filter(
            (item) => item !== category
          ),
        };
      }

      return {
        ...prev,
        categoriesHandled: [...prev.categoriesHandled, category],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("/departments", formData);

      setFormData({
        name: "",
        description: "",
        categoriesHandled: [],
        email: "",
        phone: "",
      });

      fetchDepartments();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create department"
      );
    } finally {
      setSaving(false);
    }
  };

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
        error.response?.data?.message || "Failed to delete department"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white text-lg font-medium">
          Loading departments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-3">
            Department Administration
          </span>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Manage Government Departments ({departments.length})
          </h1>

          <p className="text-slate-300 text-sm md:text-base">
            Create, update, and categorize municipal departments for complaint routing.
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Create Department Form */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Department</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Roads & Infrastructure Department"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Department Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="roads@municipality.gov"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 800 555 ROAD"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="Responsible for pothole repairs, resurfacing, road signs..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition text-sm"
                />
              </div>
            </div>

            {/* Categories Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Categories Handled
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {categoryOptions.map((cat) => {
                  const isChecked = formData.categoriesHandled.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`p-3 rounded-2xl border text-center font-semibold text-xs transition ${
                        isChecked
                          ? "bg-purple-500/20 border-purple-400 text-purple-300 shadow-md"
                          : "bg-slate-900/60 border-slate-700/80 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {isChecked ? "✓ " : ""}{cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || formData.categoriesHandled.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-purple-500/20 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? "Creating Department..." : "Create & Register Department"}
            </button>
          </form>
        </div>

        {/* Existing Department List */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-6 tracking-tight">
            Existing Municipal Departments ({departments.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {departments.map((dept) => (
              <div
                key={dept._id}
                className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-white">{dept.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                      ID: {dept._id.slice(-6)}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">{dept.description}</p>

                  <div className="text-xs text-slate-400 space-y-1 pt-2">
                    <p>📧 Email: <span className="text-slate-200 font-semibold">{dept.email}</span></p>
                    <p>📞 Phone: <span className="text-slate-200 font-semibold">{dept.phone}</span></p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {dept.categoriesHandled?.map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/90 text-cyan-300 border border-white/10"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Officers: {dept.officerIds?.length || 0} assigned
                  </span>

                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition"
                  >
                    Delete Department
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Departments;