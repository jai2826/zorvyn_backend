import { LibraryBigIcon } from "lucide-react";
import { AnalyticsTabs } from "./AnalyticsTabs";
// import { UserTable } from "./components/UserTable";
// import { UserDetailsPage } from "./components/UserDetailsPage";
// import { UserDetails } from "./UserDetails";

export function AnalystPanel() {
  return (
    <div className="space-y-6">
      {/* 🛡️ Header stays visible for all sub-routes */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <LibraryBigIcon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Audit & Analytics
          </h1>
          <p className="text-muted-foreground">
            Dive deep into financial data and generate
            insights for strategic decisions.
          </p>
        </div>
      </div>
      <AnalyticsTabs/>

    </div>
  );
}
