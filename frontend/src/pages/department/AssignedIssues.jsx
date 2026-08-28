import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

const AssignedIssues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [currentDeptName, setCurrentDeptName] = useState("");
  const [unlinked, setUnlinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await api.get("/departments");
      const list = response.data.departments || response.data || [];
      setDepartments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  }, []);

  const fetchAssignedIssues = useCallback(async (deptId = "") => {
    try {
      setLoading(true);
      setError("");

      const url = deptId ? `/issues/assigned?departmentId=${deptId}` : "/issues/assigned";
      const response = await api.get(url);

      if (response.data.unlinked) {
        setUnlinked(true);
        setIssues([]);
      } else {
        setUnlinked(false);
        setIssues(response.data.issues || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load assigned issues"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchAssignedIssues();
  }, [fetchDepartments, fetchAssignedIssues]);

  useEffect(() => {
    if (user?.departmentId) {
      const id = user.departmentId._id || user.departmentId;
      setSelectedDeptId(id);
      if (user.departmentId.name) {
        setCurrentDeptName(user.departmentId.name);
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedDeptId && departments.length > 0) {
      const found = departments.find((d) => d._id === selectedDeptId);
      if (found) {
        setCurrentDeptName(found.name);
      }
    }
  }, [selectedDeptId, departments]);

  const handleLinkDepartment = async (e) => {
    e.preventDefault();
    if (!selectedDeptId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.put("/auth/update-department", {
        departmentId: selectedDeptId,
      });

      setSuccess("Department linked successfully!");
      setUnlinked(false);
      await fetchAssignedIssues(selectedDeptId);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to link department"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchDepartment = async (deptId) => {
    setSelectedDeptId(deptId);
    if (deptId) {
      try {
        await api.put("/auth/update-department", { departmentId: deptId });
      } catch (err) {
        console.error("Failed to update user department:", err);
      }
      fetchAssignedIssues(deptId);
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

  if (loading && issues.length === 0 && !unlinked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-lg font-medium flex items-center gap-3">
            <svg className="w-6 h-6 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading assigned issues...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Header Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20 mb-3">
                Department Works Management
              </span>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                Assigned Works & Complaints ({issues.length})
              </h1>

              <p className="text-slate-300 text-sm md:text-base">
                Viewing works assigned to{" "}
                <span className="text-emerald-300 font-bold">
                  {currentDeptName || "Selected Department"}
                </span>
                .
              </p>
            </div>

            {/* Department Switcher Dropdown */}
            {departments.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 shadow-lg">
                <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                  Active Dept:
                </span>
                <select
                  value={selectedDeptId}
                  onChange={(e) => handleSwitchDepartment(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3.5 rounded-2xl text-sm">
            {success}
          </div>
        )}

        {/* Unlinked State or Issues Grid */}
        {unlinked ? (
          <div className="glass-panel rounded-3xl p-10 max-w-xl mx-auto text-center space-y-6 border border-white/10 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-3xl mx-auto border border-emerald-500/20">
              🏢
            </div>
            <h2 className="text-2xl font-bold text-white">Link Your Department</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your account is not linked to a specific municipal department yet. Please select your department to view assigned complaints.
            </p>

            <form onSubmit={handleLinkDepartment} className="space-y-4 text-left">
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white font-medium text-sm focus:outline-none focus:border-emerald-400"
              >
                <option value="">-- Choose Your Department --</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.categoriesHandled?.join(", ") || "All Categories"})
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={saving || !selectedDeptId}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition"
              >
                {saving ? "Linking Department..." : "Link & View Assigned Works"}
              </button>
            </form>
          </div>
        ) : issues.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-xl mx-auto">
            <div className="text-6xl mb-2">📭</div>
            <h2 className="text-2xl font-bold text-white">No Assigned Issues</h2>
            <p className="text-slate-400 text-sm">
              There are currently no complaints assigned to{" "}
              <span className="text-emerald-300 font-bold">
                {currentDeptName || "this department"}
              </span>
              .
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <Link
                key={issue._id}
                to={`/department/issues/${issue._id}`}
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

                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition line-clamp-1">
                    {issue.title}
                  </h2>

                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Priority Level:</span>
                    <span className="text-amber-400 font-bold">{issue.priority}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 truncate">
                    <span>Location:</span>
                    <span className="text-slate-200 truncate ml-2">{issue.location?.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 pt-1">
                    <span>Assigned On:</span>
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
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

export default AssignedIssues;