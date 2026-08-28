import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const AssignDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      const [issueResponse, departmentsResponse] = await Promise.all([
        api.get(`/issues/${id}`),
        api.get("/departments"),
      ]);

      const issueData = issueResponse.data.issue;
      const departmentList = departmentsResponse.data.departments || [];

      setIssue(issueData);
      setDepartments(departmentList);

      if (issueData.assignedDepartment?._id) {
        setSelectedDepartment(issueData.assignedDepartment._id);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load assignment data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.put(`/issues/${id}/assign`, {
        assignedDepartment: selectedDepartment,
      });

      setSuccess("Department assigned successfully!");

      setTimeout(() => {
        navigate("/authority/issues");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to assign department"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-white text-lg font-medium">
          Loading assignment data...
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Issue not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        <Link
          to="/authority/issues"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-purple-400 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to All Issues</span>
        </Link>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-4">
              Routing & Assignment
            </span>

            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Assign Municipal Department
            </h1>

            <p className="text-slate-300 text-sm">
              Route this citizen complaint to the appropriate department responsible for resolution.
            </p>
          </div>

          {/* Issue Summary Box */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white leading-snug">{issue.title}</h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                {issue.category}
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">{issue.description}</p>

            <div className="text-xs text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
              <span>Location: {issue.location?.address}</span>
              <span>Currently Assigned: <strong className="text-cyan-300">{issue.assignedDepartment?.name || "None"}</strong></span>
            </div>
          </div>

          {/* Notifications */}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3.5 rounded-2xl text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Select Department
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {departments.map((dept) => (
                  <button
                    type="button"
                    key={dept._id}
                    onClick={() => setSelectedDepartment(dept._id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                      selectedDepartment === dept._id
                        ? "bg-purple-500/20 border-purple-400 text-white font-bold shadow-lg"
                        : "bg-slate-900/60 border-slate-700/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{dept.name}</p>
                      <p className="text-xs text-slate-400 leading-normal line-clamp-2">{dept.description}</p>
                    </div>

                    <div className="text-[11px] text-purple-300 font-semibold mt-3 pt-2 border-t border-white/5">
                      Handles: {dept.categoriesHandled?.join(", ") || "General"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !selectedDepartment}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-purple-500/20 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? "Assigning Department..." : "Confirm Department Assignment"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AssignDepartment;
