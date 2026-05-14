import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const AssignDepartment = () => {
  const { id } = useParams(); // issue id
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
      const departmentList =
        departmentsResponse.data.departments || [];

      setIssue(issueData);
      setDepartments(departmentList);

      if (issueData.assignedDepartment?._id) {
        setSelectedDepartment(
          issueData.assignedDepartment._id
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load assignment data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.put(`/issues/${id}`, {
        assignedDepartment: selectedDepartment,
      });

      setSuccess("Department assigned successfully!");

      setTimeout(() => {
        navigate("/authority/issues");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to assign department"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading assignment data...
        </p>
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
          <span className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-semibold mb-4">
            Authority Portal
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Assign Department
          </h1>

          <p className="text-slate-300 text-lg">
            Route this issue to the appropriate department.
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
            Current Department:{" "}
            <span className="text-white font-semibold">
              {issue.assignedDepartment?.name || "Not Assigned"}
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
            <div>
              <label className="block text-slate-200 font-medium mb-2">
                Select Department
              </label>

              <select
                value={selectedDepartment}
                onChange={(e) =>
                  setSelectedDepartment(e.target.value)
                }
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="">Choose a Department</option>

                {departments.map((department) => (
                  <option
                    key={department._id}
                    value={department._id}
                  >
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold text-lg shadow-lg transition duration-300"
            >
              {saving
                ? "Assigning Department..."
                : "Assign Department"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignDepartment;
