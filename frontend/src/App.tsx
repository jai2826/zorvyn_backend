import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";
import { Toaster } from "sonner";
import { Navbar } from "./components/layout/Navbar";
import { LoginForm } from "./pages/auth/login-form";
import { SignupForm } from "./pages/auth/signup-form";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { AdminPanel } from "./pages/admin/AdminPanel";
import { AnalystPanel } from "./pages/analyst/AnalystPanel";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once before showing an error
      refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
      staleTime: 2 * 60 * 1000, // Data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Unused data is garbage collected after 10 minutes
    },
  },
});
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar only shows if the user is authenticated */}
      {isAuthenticated && <Navbar />}

      <main className="flex-1 container mx-auto max-w-7xl p-4">
        <Routes>
          {/* Public Routes: Redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginForm />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignupForm />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* Protected Routes: Everyone authenticated can see */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes: ONLY Admins can see */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          {/* Analyst Routes: ONLY Analysts and Admins can see */}
          <Route
            path="/analyst/*"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "ANALYST"]}>
                <AnalystPanel />
              </ProtectedRoute>
            }
          />

          {/* Root Redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}
