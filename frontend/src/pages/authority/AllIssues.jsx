import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIssues = async () => {
    try {
      // Retrieves all issues for authority users
      const response = await api.get("/issues");
      setIssues(response.data.issues || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load issues"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "in progress":
        return "bg-blue-500/20 text-blue-300 border-blue-400/30";
      case "resolved":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-400/30";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "text-green-300";
      case "medium":
        return "text-yellow-300";
      case "high":
        return "text-orange-300";
      case "critical":
        return "text-red-300";
      default:
        return "text-slate-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading all issues...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-semibold mb-4">
            Authority Portal
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            All Reported Issues
          </h1>

          <p className="text-slate-300 text-lg">
            Monitor and manage every issue across the system.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Empty State */}
        {issues.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No Issues Found
            </h2>
            <p className="text-slate-300">
              Reported issues will appear here.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition duration-300"
              >
                <div className="flex flex-wrap gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status}
                  </span>

                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-800/60 text-slate-200">
                    {issue.category}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {issue.title}
                </h3>

                <p className="text-slate-300 mb-4 line-clamp-3">
                  {issue.description}
                </p>

                <div className="space-y-2 text-sm mb-5">
                  <p className="text-slate-400">
                    Priority:{" "}
                    <span
                      className={`font-semibold ${getPriorityColor(
                        issue.priority
                      )}`}
                    >
                      {issue.priority}
                    </span>
                  </p>

                  <p className="text-slate-400">
                    Location:{" "}
                    <span className="text-slate-200">
                      {issue.location?.address}
                    </span>
                  </p>

                  <p className="text-slate-400">
                    Reported By:{" "}
                    <span className="text-slate-200">
                      {issue.reportedBy?.name || "Citizen"}
                    </span>
                  </p>

                  <p className="text-slate-400">
                    Assigned Department:{" "}
                    <span className="text-slate-200">
                      {issue.assignedDepartment?.name ||
                        "Not Assigned"}
                    </span>
                  </p>
                </div>

                <Link
                  to={`/authority/issues/${issue._id}/assign`}
                  className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold transition"
                >
                  Assign Department
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIssues;