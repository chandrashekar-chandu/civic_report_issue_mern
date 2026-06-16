// src/pages/citizen/CreateIssue.jsx
// REPLACE YOUR ENTIRE FILE WITH THIS UPDATED VERSION

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateIssue = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Road",
    priority: "Medium",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle text/select fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit form using FormData (required for file uploads)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();

      submitData.append("title", formData.title);
      submitData.append(
        "description",
        formData.description
      );
      submitData.append("category", formData.category);
      submitData.append("priority", formData.priority);

      // Send location as JSON string
      submitData.append(
        "location",
        JSON.stringify({
          address: formData.location,
          latitude: 17.0005,
          longitude: 81.8040,
        })
      );

      // IMPORTANT: field name must match upload.single("image")
      if (image) {
        submitData.append("image", image);
      }

      await api.post("/issues", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/citizen/issues");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create issue"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-semibold mb-4">
            Citizen Portal
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Report a Civic Issue
          </h1>

          <p className="text-slate-300 text-lg">
            Submit complaints with photo evidence.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <input
              type="text"
              name="title"
              placeholder="Issue Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            {/* Description */}
            <textarea
              name="description"
              rows="5"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />

            {/* Category */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="Road">Road</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Street Light">Street Light</option>
              <option value="Other">Other</option>
            </select>

            {/* Priority */}
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Location */}
            <input
              type="text"
              name="location"
              placeholder="Location Address"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            {/* Image Upload */}
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Upload Image (Optional)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white"
              />
            </div>

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-72 object-cover rounded-2xl border border-slate-700"
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-lg shadow-lg transition duration-300"
            >
              {loading
                ? "Submitting Issue..."
                : "Submit Issue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIssue;