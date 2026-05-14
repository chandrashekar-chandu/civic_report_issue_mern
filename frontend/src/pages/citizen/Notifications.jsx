// src/pages/citizen/Notifications.jsx
// REPLACE YOUR ENTIRE FILE WITH THIS CODE

import { useEffect, useState } from "react";
import api from "../../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.notifications || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification._id !== id
        )
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-teal-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-semibold mb-4">
            Notifications Center
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Notifications
          </h1>

          <p className="text-slate-300 text-lg">
            Stay updated with issue assignments and status changes.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Mark All as Read */}
        {notifications.length > 0 && (
          <div className="mb-6">
            <button
              onClick={markAllAsRead}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-lg transition"
            >
              Mark All as Read
            </button>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No Notifications
            </h2>
            <p className="text-slate-300">
              You do not have any notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white/10 backdrop-blur-xl border rounded-3xl shadow-xl p-6 ${
                  notification.isRead
                    ? "border-white/10"
                    : "border-cyan-400/40"
                }`}
              >
                {/* Message */}
                <p className="text-white text-lg leading-7 mb-4">
                  {notification.message}
                </p>

                {/* Optional Issue Info */}
                {notification.issueId && (
                  <div className="mb-4 text-sm text-slate-300 space-y-1">
                    <p>
                      <span className="font-semibold">
                        Issue:
                      </span>{" "}
                      {notification.issueId.title}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {
                        notification.issueId?.location
                          ?.address
                      }
                    </p>
                  </div>
                )}

                {/* Date */}
                <p className="text-slate-400 text-sm mb-5">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        markAsRead(notification._id)
                      }
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteNotification(
                        notification._id
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;