import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyIssues = async () => {
    try {
      const response = await api.get("/issues/my-issues");
      setIssues(response.data.issues || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load your issues"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "assigned":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
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
            <svg className="w-6 h-6 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading your submitted issues...
          </p>
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
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/20 mb-3">
                My Complaints History
              </span>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                Reported Civic Complaints ({issues.length})
              </h1>

              <p className="text-slate-300 text-sm md:text-base">
                Track status updates and responses from municipal authorities.
              </p>
            </div>

            <Link
              to="/citizen/create-issue"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 shrink-0"
            >
              <span>Report New Issue</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Issues List or Empty State */}
        {issues.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-xl mx-auto">
            <div className="text-6xl mb-2">📭</div>
            <h2 className="text-2xl font-bold text-white">No Complaints Reported Yet</h2>
            <p className="text-slate-400 text-sm">
              You haven't submitted any civic issues yet. Click below to file your first complaint.
            </p>
            <Link
              to="/citizen/create-issue"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm transition shadow-lg shadow-cyan-500/20 mt-2"
            >
              <span>Create First Report</span>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <Link
                key={issue._id}
                to={`/citizen/issues/${issue._id}`}
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

                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition line-clamp-1">
                    {issue.title}
                  </h2>

                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Priority Level:</span>
                    <span className={getPriorityBadge(issue.priority)}>{issue.priority}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 truncate">
                    <span>Location:</span>
                    <span className="text-slate-200 truncate ml-2">{issue.location?.address}</span>
                  </div>

                  {issue.assignedDepartment && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Assigned Department:</span>
                      <span className="text-cyan-300 font-semibold">{issue.assignedDepartment.name || "Assigned"}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span>Reported On:</span>
                    <span>{new Date(issue.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyIssues;