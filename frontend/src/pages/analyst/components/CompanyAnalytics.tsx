import api from "../../../api/axios";

import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
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
import type { Summary } from "../../../lib/api_types";

export const CompanyAnalytics = () => {
  const { data: stats, isLoading } = useQuery<Summary>({
    queryKey: ["companyAnalyticsSummary"],
    queryFn: async () => {
      const res = await api.get(`/analytics/summary`);
      return res.data;
    },
  });
  const NetProfit =
    (stats?.totalIncome ?? 0) - (stats?.totalExpense ?? 0);

  if (isLoading)
    return (
      <div className="p-10 text-center">
        Crunching company data...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {`$ ${(stats?.totalIncome || 0).toLocaleString()}`}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {`$ ${NetProfit.toLocaleString()}`}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Burn
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {`$ ${(stats?.totalExpense || 0).toLocaleString()}`}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Departmental Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead className="text-right">
                    Total Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.expenseByCategories?.map(
                  (cat: any) => (
                    <TableRow key={cat.category}>
                      <TableCell className="font-medium">
                        {cat.category}
                      </TableCell>
                      <TableCell>{cat.count}</TableCell>
                      <TableCell className="text-destructive text-right font-mono">
                        ${cat.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Departmental Income</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead className="text-right">
                    Total Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.incomeByCategories?.map(
                  (cat: any) => (
                    <TableRow key={cat.category}>
                      <TableCell className="font-medium">
                        {cat.category}
                      </TableCell>
                      <TableCell>{cat.count}</TableCell>
                      <TableCell className="text-green-500 text-right font-mono">
                        ${cat.amount}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
