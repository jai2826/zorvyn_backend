import { ShieldAlert } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import { UserTable } from "./components/UserTable";
import { UserDetailsPage } from "./components/UserDetailsPage";
// import { UserDetails } from "./UserDetails";

export function AdminPanel() {
  return (
    <div className="space-y-6">
      {/* 🛡️ Header stays visible for all sub-routes */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <ShieldAlert className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-muted-foreground">
            Manage user permissions and system access.
          </p>
        </div>
      </div>

      <Routes>
        {/* Matches exactly /admin */}
        <Route
          index
          element={<UserTable />}
        />

        {/* Matches /admin/user/:userId */}
        <Route
          path="user/:userId"
          element={<UserDetailsPage />}
        />
      </Routes>
    </div>
  );
}
