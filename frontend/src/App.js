import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

// Citizen Pages
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CreateIssue from "./pages/citizen/CreateIssue";
import MyIssues from "./pages/citizen/MyIssues";
import IssueDetails from "./pages/citizen/IssueDetails";
import Notifications from "./pages/citizen/Notifications";

// Department Pages
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import AssignedIssues from "./pages/department/AssignedIssues";
import UpdateIssueStatus from "./pages/department/UpdateIssueStatus";

// Authority Pages
import AuthorityDashboard from "./pages/authority/AuthorityDashboard";
import AllIssues from "./pages/authority/AllIssues";
import AssignDepartment from "./pages/authority/AssignDepartment";
import Departments from "./pages/authority/Departments";
import Analytics from "./pages/authority/Analytics";

function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-xl">
        Loading...
      </div>
    );
  }

  const getDashboardRoute = () => {
    if (!user) return "/login";

    if (user.role === "authority") return "/authority";
    if (user.role === "department") return "/department";

    return "/citizen";
  };

  return (
    <Routes>
      {/* Root Redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRoute()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* =========================
          CITIZEN ROUTES
      ========================= */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/create-issue"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CreateIssue />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/issues"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <MyIssues />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/issues/:id"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <IssueDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/notifications"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* =========================
          DEPARTMENT ROUTES
      ========================= */}
      <Route
        path="/department"
        element={
          <ProtectedRoute allowedRoles={["department"]}>
            <DepartmentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/department/issues"
        element={
          <ProtectedRoute allowedRoles={["department"]}>
            <AssignedIssues />
          </ProtectedRoute>
        }
      />

      <Route
        path="/department/issues/:id"
        element={
          <ProtectedRoute allowedRoles={["department"]}>
            <UpdateIssueStatus />
          </ProtectedRoute>
        }
      />

      {/* =========================
          AUTHORITY ROUTES
      ========================= */}
      <Route
        path="/authority"
        element={
          <ProtectedRoute allowedRoles={["authority"]}>
            <AuthorityDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/authority/issues"
        element={
          <ProtectedRoute allowedRoles={["authority"]}>
            <AllIssues />
          </ProtectedRoute>
        }
      />

      <Route
        path="/authority/issues/:id/assign"
        element={
          <ProtectedRoute allowedRoles={["authority"]}>
            <AssignDepartment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/authority/departments"
        element={
          <ProtectedRoute allowedRoles={["authority"]}>
            <Departments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/authority/analytics"
        element={
          <ProtectedRoute allowedRoles={["authority"]}>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Catch-All Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;