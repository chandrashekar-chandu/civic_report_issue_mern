import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchAllIssues = async () => {
    try {
      const response = await api.get("/issues");
      setIssues(response.data.issues || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load issues"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllIssues();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "assigned":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "in progress":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      case "resolved":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "rejected":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/30";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "text-red-400 font-bold";
      case "high":
        return "text-orange-400 font-semibold";
      case "medium":
        return "text-yellow-400 font-semibold";
      default:
        return "text-emerald-400 font-semibold";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-lg font-medium flex items-center gap-3">
            <svg className="w-6 h-6 animate-spin text-purple-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading system issues...
          </p>
        </div>
      </div>
    );
  }

  const filteredIssues =
    filterStatus === "All"
      ? issues
      : issues.filter((i) => i.status?.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-3">
                System-Wide Oversight
              </span>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                All Reported Complaints ({issues.length})
              </h1>

              <p className="text-slate-300 text-sm md:text-base">
                Inspect, route, and assign citizen complaints to municipal departments.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 shrink-0">
              {["All", "Pending", "Assigned", "In Progress", "Resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterStatus === st
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Issues List */}
        {filteredIssues.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-xl mx-auto">
            <div className="text-6xl mb-2">📭</div>
            <h2 className="text-2xl font-bold text-white">No Complaints Found</h2>
            <p className="text-slate-400 text-sm">
              No reported issues match your selected filter state.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredIssues.map((issue) => (
              <div
                key={issue._id}
                className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(issue.status)}`}>
                      ● {issue.status}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-300 border border-white/10">
                      {issue.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition line-clamp-1">
                    {issue.title}
                  </h3>

                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>
                      <span>Priority:</span>{" "}
                      <span className={getPriorityBadge(issue.priority)}>{issue.priority}</span>
                    </div>

                    <div>
                      <span>Reported By:</span>{" "}
                      <span className="text-slate-200 font-semibold">{issue.reportedBy?.name || "Citizen"}</span>
                    </div>
                  </div>

                  <div className="text-slate-400 truncate">
                    <span>Location:</span>{" "}
                    <span className="text-slate-200">{issue.location?.address}</span>
                  </div>

                  <div className="text-slate-400">
                    <span>Assigned Department:</span>{" "}
                    <span className="text-cyan-300 font-bold">
                      {issue.assignedDepartment?.name || "Not Assigned"}
                    </span>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/authority/issues/${issue._id}/assign`}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>Assign / Re-route Department</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllIssues;