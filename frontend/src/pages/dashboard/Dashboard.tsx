import { DollarSign, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { CreateTransactionModal } from "../../components/modals/CreateTransactionModal";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useAuth } from "../../context/AuthContext";

export function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/transactions");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch records", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);

  // Calculate simple stats for the UI
  const totalIncome = data.filter(r => r.type === "INCOME").reduce((acc, r) => acc + r.amount, 0);
  const totalExpense = data.filter(r => r.type === "EXPENSE").reduce((acc, r) => acc + r.amount, 0);
  const balance = totalIncome - totalExpense;

  if (loading) return <div className="flex justify-center p-10">Loading Financial Data...</div>;

  return (
    <>
      <CreateTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
      <div className="space-y-8 px-0 mx-0">
        {/* Header Section */}
        <div className="flex  justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Financial Overview</h2>
            <p className="text-muted-foreground">Monitoring Zorvyn's cash flow and records.</p>
          </div>



          <Button className="flex gap-2" onClick={() => setIsTransactionModalOpen(true)}>
            <PlusCircle className="w-4 h-4" /> Add Transaction
          </Button>

        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${totalIncome.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-${totalExpense.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{record.description}</TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell className={record.type === "INCOME" ? "text-green-600" : "text-red-600"}>
                      {record.type === "INCOME" ? "+" : "-"}${record.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={record.type === "INCOME" ? "default" : "destructive"}>
                        {record.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}