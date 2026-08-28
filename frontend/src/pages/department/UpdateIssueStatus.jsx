import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const UpdateIssueStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);

  const fetchIssue = useCallback(async () => {
    try {
      const response = await api.get(`/issues/${id}`);
      setIssue(response.data.issue);
      setStatus(response.data.issue.status);
    } catch (error) {
      console.error("Fetch Issue Error:", error);
      alert("Failed to load issue.");
    }
  }, [id]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/issues/${id}/status`, {
        status,
      });

      alert("Issue status updated successfully.");
      navigate("/department/issues");
    } catch (error) {
      console.error(
        "Update Status Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message || "Failed to update issue."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { id: "Pending", icon: "⏳", color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
    { id: "Assigned", icon: "📋", color: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
    { id: "In Progress", icon: "🔄", color: "border-blue-500/40 text-blue-400 bg-blue-500/10" },
    { id: "Resolved", icon: "✅", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
    { id: "Rejected", icon: "❌", color: "border-rose-500/40 text-rose-400 bg-rose-500/10" },
  ];

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white text-lg">
          Loading issue details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/department/issues"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Assigned Issues</span>
        </Link>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20 mb-4">
              Status Update Portal
            </span>

            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Update Resolution Progress
            </h1>

            <p className="text-slate-300 text-sm">
              Change the status of this complaint to inform the citizen and authorities.
            </p>
          </div>

          {/* Issue Summary Box */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white leading-snug">{issue.title}</h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                {issue.category}
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">{issue.description}</p>

            <div className="text-xs text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
              <span>Location: {issue.location?.address}</span>
              <span>Priority: <strong className="text-amber-400">{issue.priority}</strong></span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Select Status
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {statusOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setStatus(opt.id)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                      status === opt.id
                        ? `${opt.color} ring-1 ring-white/20 font-bold shadow-lg`
                        : "bg-slate-900/60 border-slate-700/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <span>{opt.icon}</span>
                      <span>{opt.id}</span>
                    </span>
                    {status === opt.id && <span className="text-xs">✓ Active</span>}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base shadow-lg shadow-emerald-500/20 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Updating Status..." : "Save & Update Status"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateIssueStatus;