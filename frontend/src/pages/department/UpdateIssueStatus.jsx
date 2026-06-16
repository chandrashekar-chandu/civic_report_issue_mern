import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const UpdateIssueStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const response = await api.get(`/issues/${id}`);
      setIssue(response.data.issue);
      setStatus(response.data.issue.status);
    } catch (error) {
      console.error("Fetch Issue Error:", error);
      alert("Failed to load issue.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // IMPORTANT: Correct backend endpoint
      await api.put(`/issues/${id}/status`, {
        status,
      });

      alert("Issue status updated successfully.");
      navigate("/department/assigned-issues");
    } catch (error) {
      console.error(
        "Update Status Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update issue."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Update Issue Status
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-cyan-400">
            {issue.title}
          </h2>
          <p className="text-slate-300 mt-2">
            {issue.description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white border border-slate-600"
          >
            <option value="Pending">
              Pending
            </option>
            <option value="Assigned">
              Assigned
            </option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Resolved">
              Resolved
            </option>
            <option value="Rejected">
              Rejected
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
          >
            {loading
              ? "Updating..."
              : "Update Status"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateIssueStatus;