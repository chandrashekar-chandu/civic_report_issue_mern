import { useEffect, useState } from "react";
import api from "../../services/api";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/analytics");
      setAnalytics(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatLabel = (value) => {
    if (!value) return "Unknown";

    // Handles ObjectId values from department grouping
    if (typeof value === "object") return "Department";

    return String(value);
  };

  const renderGroup = (title, data) => (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        {title}
      </h2>

      {!data || data.length === 0 ? (
        <p className="text-slate-300">No data available.</p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700"
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-200 font-medium">
                  {formatLabel(item._id)}
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading analytics...</p>
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
            System Analytics
          </h1>

          <p className="text-slate-300 text-lg">
            Track issue trends, priorities, and department workload.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Total Issues */}
        {analytics && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
            <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">
              Total Issues
            </p>
            <p className="text-5xl font-bold text-white">
              {analytics.totalIssues}
            </p>
          </div>
        )}

        {/* Analytics Groups */}
        {analytics && (
          <div className="grid lg:grid-cols-2 gap-6">
            {renderGroup(
              "Issues by Status",
              analytics.issuesByStatus
            )}
            {renderGroup(
              "Issues by Category",
              analytics.issuesByCategory
            )}
            {renderGroup(
              "Issues by Department",
              analytics.issuesByDepartment
            )}
            {renderGroup(
              "Issues by Priority",
              analytics.issuesByPriority
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;