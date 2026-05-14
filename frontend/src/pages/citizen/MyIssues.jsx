import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyIssues = async () => {
    try {
      const response = await api.get("/issues/my");
      setIssues(response.data.issues || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load your issues"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading your issues...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-semibold mb-4">
            Citizen Portal
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            My Complaints
          </h1>

          <p className="text-slate-300 text-lg">
            Track all issues you have reported.
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
              You have not submitted any complaints yet.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <Link
                key={issue._id}
                to={`/citizen/issues/${issue._id}`}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 hover:bg-white/15 hover:scale-[1.02] transition duration-300"
              >
                <h2 className="text-2xl font-bold text-white mb-3">
                  {issue.title}
                </h2>

                <p className="text-slate-300 mb-4 line-clamp-3">
                  {issue.description}
                </p>

                <div className="space-y-2 text-sm">
                  <p className="text-cyan-300 font-semibold">
                    Category: {issue.category}
                  </p>

                  <p className="text-yellow-300 font-semibold">
                    Priority: {issue.priority}
                  </p>

                  <p className="text-green-300 font-semibold">
                    Status: {issue.status}
                  </p>

                  {/* Updated location rendering */}
                  <p className="text-slate-400">
                    Location: {issue.location?.address}
                  </p>

                  <p className="text-slate-500">
                    {new Date(
                      issue.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;