// src/pages/citizen/IssueDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const IssueDetails = () => {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] =
    useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch issue details and comments
  // ==========================================
  const fetchIssueDetails = async () => {
    try {
      const issueResponse = await api.get(`/issues/${id}`);
      const commentsResponse = await api.get(
        `/comments/issue/${id}`
      );

      setIssue(issueResponse.data.issue);
      setComments(commentsResponse.data.comments || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load issue details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchIssueDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

  // ==========================================
  // Add new comment
  // ==========================================
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);

      await api.post("/comments", {
        issueId: id,
        text: newComment,
      });

      // Refresh comments
      const commentsResponse = await api.get(
        `/comments/issue/${id}`
      );

      setComments(commentsResponse.data.comments || []);
      setNewComment("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  // ==========================================
  // Status badge colors
  // ==========================================
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "assigned":
        return "bg-purple-500/20 text-purple-300 border-purple-400/30";
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

  // ==========================================
  // Priority colors
  // ==========================================
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

  // ==========================================
  // Loading state
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading issue details...
        </p>
      </div>
    );
  }

  // ==========================================
  // Error state
  // ==========================================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
        <div className="max-w-4xl mx-auto bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!issue) return null;

  // Safe location rendering
  const locationAddress =
    typeof issue.location === "object"
      ? issue.location?.address
      : issue.location;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ==========================================
            ISSUE DETAILS CARD
        ========================================== */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                issue.status
              )}`}
            >
              {issue.status}
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-800/60 text-slate-200 text-sm font-medium">
              {issue.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">
            {issue.title}
          </h1>

          {/* Description */}
          <p className="text-slate-300 leading-8 mb-6">
            {issue.description}
          </p>

          {/* Image */}
          {issue.imageUrl && (
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="w-full max-h-96 object-cover rounded-2xl mb-6 border border-slate-700"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          {/* Metadata */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 text-sm">
                Priority
              </p>
              <p
                className={`text-xl font-semibold ${getPriorityColor(
                  issue.priority
                )}`}
              >
                {issue.priority}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Location
              </p>
              <p className="text-white font-medium">
                {locationAddress || "Not Available"}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">
                Created On
              </p>
              <p className="text-white font-medium">
                {new Date(
                  issue.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            ADD COMMENT FORM
        ========================================== */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Add Comment
          </h2>

          <form
            onSubmit={handleAddComment}
            className="space-y-4"
          >
            <textarea
              rows="4"
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) =>
                setNewComment(e.target.value)
              }
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />

            <button
              type="submit"
              disabled={
                submittingComment ||
                !newComment.trim()
              }
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg transition duration-300 disabled:opacity-50"
            >
              {submittingComment
                ? "Posting Comment..."
                : "Post Comment"}
            </button>
          </form>
        </div>

        {/* ==========================================
            COMMENTS LIST
        ========================================== */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Comments & Updates
          </h2>

          {comments.length === 0 ? (
            <p className="text-slate-300">
              No comments have been added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-slate-900/40 border border-slate-700 rounded-2xl p-5"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <p className="text-white font-semibold">
                        {comment.userId?.name ||
                          "Unknown User"}
                      </p>
                      <p className="text-cyan-300 text-sm capitalize">
                        {comment.userId?.role}
                      </p>
                    </div>

                    <p className="text-slate-400 text-sm">
                      {new Date(
                        comment.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-slate-300 leading-7">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;