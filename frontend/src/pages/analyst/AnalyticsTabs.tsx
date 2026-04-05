import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
// import { CompanyAnalytics } from "./components/CompanyAnalytics";
// import { UserAnalytics } from "./components/UserAnalytics";
import { Landmark, Users } from "lucide-react";
import { CompanyAnalytics } from "./components/CompanyAnalytics";
import { UserAnalytics } from "./components/UserAnalytics";

export function AnalyticsTabs() {
  return (
    <div className="space-y-6 w-full h-full">
      <Tabs
        defaultValue="company"
        className="w-full">
        <TabsList className="p-0.5  grid w-full max-w-3xl grid-cols-2 rounded-md">
          <TabsTrigger
            value="company"
            className="gap-2 rounded-md">
            <Landmark className="w-4 h-4" /> Company
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="user"
            className="gap-2 rounded-md">
            <Users className="w-4 h-4" /> User Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="company"
          className="mt-6">
          <CompanyAnalytics />
        </TabsContent>

        <TabsContent
          value="user"
          className="mt-6">
          <UserAnalytics /> 
        </TabsContent>
      </Tabs>
    </div>
  );
}
