import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const CreateIssue = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Road",
    priority: "Medium",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { id: "Road", icon: "🛣️" },
    { id: "Water", icon: "💧" },
    { id: "Electricity", icon: "⚡" },
    { id: "Sanitation", icon: "🧹" },
    { id: "Street Light", icon: "💡" },
    { id: "Other", icon: "📦" },
  ];

  const priorities = [
    { id: "Low", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
    { id: "Medium", color: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10" },
    { id: "High", color: "border-orange-500/40 text-orange-400 bg-orange-500/10" },
    { id: "Critical", color: "border-red-500/40 text-red-400 bg-red-500/10" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("priority", formData.priority);

      submitData.append(
        "location",
        JSON.stringify({
          address: formData.location,
          latitude: 17.0005,
          longitude: 81.8040,
        })
      );

      if (image) {
        submitData.append("image", image);
      }

      await api.post("/issues", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/citizen/issues");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create issue"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Header Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/20 mb-4">
            Civic Issue Reporting Form
          </span>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Report a Civic Issue
          </h1>

          <p className="text-slate-300 text-sm md:text-base">
            Submit infrastructure complaints directly to municipal authorities with optional photographic evidence.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Issue Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Deep Pothole on Main Street near Market"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Detailed Description
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the condition, exact landmark, and any potential hazard to commuters..."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm resize-none"
              />
            </div>

            {/* Category Selector Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Category
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleChange({ target: { name: "category", value: cat.id } })}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition ${
                      formData.category === cat.id
                        ? "bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-md"
                        : "bg-slate-900/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-semibold">{cat.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selector Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Priority Level
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {priorities.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleChange({ target: { name: "priority", value: p.id } })}
                    className={`py-3 px-4 rounded-2xl border text-center font-bold text-xs transition ${
                      formData.priority === p.id
                        ? `${p.color} ring-1 ring-white/20 shadow-md`
                        : "bg-slate-900/60 border-slate-700/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {p.id} Priority
                  </button>
                ))}
              </div>
            </div>

            {/* Location Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Location Address / Landmark
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. 42nd Avenue, Block B, Opposite Central Library"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm"
              />
            </div>

            {/* Image Upload Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Upload Image Evidence (Optional)
              </label>

              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-2xl p-6 text-center bg-slate-900/40 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl">
                    📸
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    {image ? image.name : "Click or drag image file here to upload"}
                  </p>
                  <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              </div>
            </div>

            {/* Preview Image */}
            {preview && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-700">
                <img
                  src={preview}
                  alt="Issue Upload Preview"
                  className="w-full max-h-72 object-cover"
                />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-cyan-300 font-semibold border border-white/10">
                  Image Attachment Preview
                </span>
              </div>
            )}

            {/* Submit Button */}
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
                  <span>Submitting Complaint...</span>
                </>
              ) : (
                <>
                  <span>Submit Civic Issue</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateIssue;