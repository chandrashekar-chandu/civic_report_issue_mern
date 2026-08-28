import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

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
        error.response?.data?.message || "Failed to load notifications"
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
        prev.filter((notification) => notification._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
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
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-3">
                Notification Feed
              </span>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                Notifications Center ({notifications.length})
              </h1>

              <p className="text-slate-300 text-sm md:text-base">
                Real-time alerts regarding status updates, department assignments, and complaint resolutions.
              </p>
            </div>

            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2 shrink-0"
              >
                <span>Mark All as Read ({unreadCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3.5 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-xl mx-auto">
            <div className="text-6xl mb-2">🔔</div>
            <h2 className="text-2xl font-bold text-white">No Unread Notifications</h2>
            <p className="text-slate-400 text-sm">
              You are completely caught up! New updates regarding your complaints will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`glass-card rounded-3xl p-6 border transition-all ${
                  notification.isRead
                    ? "border-white/5 opacity-80"
                    : "border-cyan-500/40 bg-slate-900/80 shadow-lg shadow-cyan-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {!notification.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                    )}
                    <p className="text-white text-base font-semibold leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {notification.issueId && (
                  <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 text-xs text-slate-300 space-y-1 mb-4">
                    <p>
                      <span className="text-slate-400">Issue Title:</span>{" "}
                      <span className="font-semibold text-white">{notification.issueId.title}</span>
                    </p>
                    {notification.issueId.location?.address && (
                      <p>
                        <span className="text-slate-400">Location:</span>{" "}
                        <span className="text-slate-300">{notification.issueId.location.address}</span>
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                  <span className="text-slate-500">
                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-semibold transition"
                      >
                        Mark as Read
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;