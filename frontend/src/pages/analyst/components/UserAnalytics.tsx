import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Users,
  UsersIcon,
} from "lucide-react";
import api from "../../../api/axios";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { UserSummary } from "../../../lib/api_types";
import { cn } from "../../../lib/utils";

export const UserAnalytics = () => {
  const {
    data: rawData,
    isLoading,
    isError,
  } = useQuery<UserSummary>({
    queryKey: ["userAnalyticsSummary"],
    queryFn: async () => {
      const res = await api.get(`/analytics/user/summary`);
      return res.data;
    },
  });

  const data = Array.isArray(rawData) ? rawData : [];
  const totalTransactions = data.reduce(
    (acc, user) => acc + (user.transactionCount || 0),
    0,
  );
  console.log(totalTransactions);

  if (isLoading) {
    return (
      <div className="p-10 text-center animate-pulse text-muted-foreground">
        Analyzing user behaviors...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load system analytics.
      </div>
    );
  }

  const totalUsers = data.length;
  const activeUsers = data.filter(
    (u: any) => u.isActive,
  ).length;

  const topSpender =
    data.length > 0
      ? data.reduce((prev: any, current: any) =>
          prev.totalExpense > current.totalExpense
            ? prev
            : current,
        )
      : { email: "N/A", totalExpense: 0 };

  const adoptionRate =
    totalUsers > 0
      ? Math.round((activeUsers / totalUsers) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registered
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Adoption
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {`${adoptionRate}%`}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total System Spender
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {topSpender.email}
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Behavior Leaderboard</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ranking users by system activity and financial
              impact.
            </p>
          </div>
          <Users className="text-muted-foreground h-5 w-5" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>User / Role</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">
                  Total Income
                </TableHead>
                <TableHead className="text-right">
                  Total Expense
                </TableHead>
                <TableHead className="text-right">
                  Net Balance
                </TableHead>
                <TableHead className="text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user: any) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary truncate max-w-[180px]">
                        {user.email}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground tracking-tighter">
                        {user.role}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-muted-foreground/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-500"
                          style={{
                            width: `${
                              totalTransactions > 0
                                ? (user.transactionCount /
                                    totalTransactions) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {user.transactionCount || 0} tx
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-500">
                    $
                    {(
                      user.totalIncome || 0
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-red-500">
                    $
                    {(
                      user.totalExpense || 0
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono font-bold",
                      (user.netBalance || 0) >= 0
                        ? "text-emerald-600"
                        : "text-red-600",
                    )}>
                    $
                    {(
                      user.netBalance || 0
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.isRisk ? (
                      <Badge
                        variant="destructive"
                        className="gap-1 animate-pulse">
                        <AlertTriangle className="h-3 w-3" />{" "}
                        Audit
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-emerald-600 bg-emerald-50 border-emerald-100">
                        Healthy
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground">
                    No system activity detected yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
