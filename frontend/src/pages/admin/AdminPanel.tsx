import { ShieldAlert } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import { UserDetailsPage } from "./components/UserDetailsPage";
import { UserTable } from "./components/UserTable";


export function AdminPanel() {
  return (
    <div className="space-y-6">
      {}
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
        {}
        <Route
          index
          element={<UserTable />}
        />

        {}
        <Route
          path="user/:userId"
          element={<UserDetailsPage />}
        />
      </Routes>
    </div>
  );
}
