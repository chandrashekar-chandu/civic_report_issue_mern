import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const IssueDetails = () => {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState("");

  const fetchIssueDetails = async () => {
    try {
      const issueResponse = await api.get(`/issues/${id}`);
      const commentsResponse = await api.get(`/comments/issue/${id}`);

      setIssue(issueResponse.data.issue);
      setComments(commentsResponse.data.comments || []);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load issue details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);

      await api.post("/comments", {
        issueId: id,
        text: newComment,
      });

      const commentsResponse = await api.get(`/comments/issue/${id}`);
      setComments(commentsResponse.data.comments || []);
      setNewComment("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

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
            <svg className="w-6 h-6 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading issue details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8">
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl">
            {error}
          </div>
        </main>
      </div>
    );
  }

  if (!issue) return null;

  const locationAddress =
    typeof issue.location === "object"
      ? issue.location?.address
      : issue.location;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to={-1}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Complaints</span>
          </Link>
          <span className="text-xs text-slate-500 font-mono">ID: {issue._id}</span>
        </div>

        {/* Issue Details Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(issue.status)}`}>
              ● {issue.status}
            </span>

            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-300 border border-white/10">
              {issue.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {issue.title}
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            {issue.description}
          </p>

          {/* Issue Image Attachment */}
          {issue.imageUrl && (
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full max-h-[480px] object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Grid Information Widgets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Priority</p>
              <p className={`text-base font-bold ${getPriorityBadge(issue.priority)}`}>{issue.priority}</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm font-semibold text-white truncate">{locationAddress || "Not Provided"}</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Department</p>
              <p className="text-sm font-semibold text-cyan-300 truncate">
                {issue.assignedDepartment?.name || "Not Assigned Yet"}
              </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Reported Date</p>
              <p className="text-sm font-semibold text-white">
                {new Date(issue.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Add Comment or Update</h2>

          <form onSubmit={handleAddComment} className="space-y-4">
            <textarea
              rows="4"
              placeholder="Post an inquiry or update regarding this complaint..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition text-sm resize-none"
            />

            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>

        {/* Comments Feed */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Comments & Activity History</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
              {comments.length}
            </span>
          </h2>

          {comments.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No comments posted on this issue yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-2"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-sm font-bold text-white">
                        {comment.userId?.name || "Anonymous User"}
                      </span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize font-medium">
                        {comment.userId?.role || "user"}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IssueDetails;