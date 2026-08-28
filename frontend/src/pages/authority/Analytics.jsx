import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

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
        error.response?.data?.message || "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatLabel = (value) => {
    if (!value) return "Unspecified / General";
    if (typeof value === "object") return "Department Officer";
    return String(value);
  };

  const renderGroup = (title, data, accentColor = "from-cyan-500 to-emerald-500") => {
    const totalCount = (data || []).reduce((acc, curr) => acc + (curr.count || 0), 0);

    return (
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
            <span>{title}</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/80 text-slate-400 border border-white/10">
              {data?.length || 0} Groups
            </span>
          </h2>

          {!data || data.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No data recorded for this metric.</p>
          ) : (
            <div className="space-y-4">
              {data.map((item, index) => {
                const percentage = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-200 font-medium">
                        {formatLabel(item._id)}
                      </span>
                      <span className="font-bold text-cyan-300">
                        {item.count} <span className="text-xs text-slate-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                      <div
                        className={`h-full bg-gradient-to-r ${accentColor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white text-lg font-medium">
          Loading analytics...
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
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20 mb-3">
            Analytics & Insights Module
          </span>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            System Infrastructure Metrics
          </h1>

          <p className="text-slate-300 text-sm md:text-base">
            Track issue trends, department workload distribution, and resolution ratios across the city.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Total Issues Overview Widget */}
        {analytics && (
          <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Reported Issues</p>
              <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400">
                {analytics.totalIssues || 0}
              </p>
              <p className="text-xs text-slate-400 mt-2">Active Complaints Recorded</p>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <span className="text-xs text-slate-400 font-semibold block uppercase">Status Types</span>
                <span className="text-2xl font-bold text-cyan-300 mt-1 block">
                  {analytics.issuesByStatus?.length || 0} States
                </span>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5">
                <span className="text-xs text-slate-400 font-semibold block uppercase">Departments Active</span>
                <span className="text-2xl font-bold text-emerald-300 mt-1 block">
                  {analytics.issuesByDepartment?.length || 0} Units
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Breakdown Grid */}
        {analytics && (
          <div className="grid lg:grid-cols-2 gap-6">
            {renderGroup(
              "Complaints by Status",
              analytics.issuesByStatus,
              "from-cyan-500 to-blue-500"
            )}
            {renderGroup(
              "Complaints by Category",
              analytics.issuesByCategory,
              "from-purple-500 to-pink-500"
            )}
            {renderGroup(
              "Complaints by Department",
              analytics.issuesByDepartment,
              "from-emerald-500 to-teal-500"
            )}
            {renderGroup(
              "Complaints by Priority Level",
              analytics.issuesByPriority,
              "from-amber-500 to-red-500"
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;