import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const UpdateIssueStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statusOptions = [
    "Pending",
    "In Progress",
    "Resolved",
    "Rejected",
  ];

  const fetchIssue = async () => {
    try {
      const response = await api.get(`/issues/${id}`);
      const issueData = response.data.issue;

      setIssue(issueData);
      setStatus(issueData.status || "Pending");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load issue"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Update issue status
      await api.put(`/issues/${id}`, {
        status,
      });

      // Add optional comment
      if (comment.trim()) {
        await api.post(`/comments/issue/${id}`, {
          text: comment,
        });
      }

      setSuccess("Issue updated successfully!");

      setTimeout(() => {
        navigate("/department/issues");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update issue"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading issue...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">Issue not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-semibold mb-4">
            Department Portal
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Update Issue Status
          </h1>

          <p className="text-slate-300 text-lg">
            Review and update the current progress of this issue.
          </p>
        </div>

        {/* Issue Summary */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            {issue.title}
          </h2>

          <p className="text-slate-300 leading-7 mb-4">
            {issue.description}
          </p>

          <p className="text-slate-400">
            Current Status:{" "}
            <span className="text-white font-semibold">
              {issue.status}
            </span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          {success && (
            <div className="mb-6 bg-green-500/20 border border-green-400/30 text-green-200 px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-slate-200 font-medium mb-2">
                New Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-slate-200 font-medium mb-2">
                Progress Comment (Optional)
              </label>

              <textarea
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add an update for the citizen..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-lg shadow-lg transition duration-300"
            >
              {saving ? "Updating Issue..." : "Update Issue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateIssueStatus;