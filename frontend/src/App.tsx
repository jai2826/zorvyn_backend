import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar } from "./components/layout/Navbar";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";
import { AdminPanel } from "./pages/admin/AdminPanel";
import { AnalystPanel } from "./pages/analyst/AnalystPanel";
import { LoginForm } from "./pages/auth/login-form";
import { SignupForm } from "./pages/auth/signup-form";
import { Dashboard } from "./pages/dashboard/Dashboard";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, 
      refetchOnWindowFocus: false, 
      staleTime: 2 * 60 * 1000, 
      gcTime: 10 * 60 * 1000, 
    },
  },
});
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {}
      {isAuthenticated && <Navbar />}

      <main className="flex-1 container mx-auto max-w-7xl p-4">
        <Routes>
          {}
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

          {}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          {}
          <Route
            path="/analyst/*"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "ANALYST"]}>
                <AnalystPanel />
              </ProtectedRoute>
            }
          />

          {}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {}
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
