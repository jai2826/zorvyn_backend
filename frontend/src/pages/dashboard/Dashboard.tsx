import { useQuery } from "@tanstack/react-query";
import { DollarSign, Filter, Loader2, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
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
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
  const { user } = useAuth();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  
  const [categoryInput, setCategoryInput] = useState(""); 
  const [debouncedCategory] = useDebounce(categoryInput, 500); 
  
  const [type, setType] = useState<string>("ALL");
  const [date, setDate] = useState<string>("");

  
  const { data = [], isLoading, isFetching } = useQuery({
    
    queryKey: ["transactions", user?.id, { category: debouncedCategory, type, date }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedCategory) params.append("category", debouncedCategory);
      if (type !== "ALL") params.append("type", type);
      if (date) params.append("date", date);

      const res = await api.get(`/transactions?${params.toString()}`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  
  const totalIncome = data.filter((r: any) => r.type === "INCOME").reduce((acc: number, r: any) => acc + r.amount, 0);
  const totalExpense = data.filter((r: any) => r.type === "EXPENSE").reduce((acc: number, r: any) => acc + r.amount, 0);
  const balance = totalIncome - totalExpense;

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse">Syncing your financial records...</p>
    </div>
  );

  return (
    <>
      <CreateTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
      
      <div className="space-y-8">
        {}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Financial Overview</h2>
            <p className="text-muted-foreground">Real-time monitoring of your cash flow.</p>
          </div>
          
          <Button className="flex gap-2" onClick={() => setIsTransactionModalOpen(true)}>
            <PlusCircle className="w-4 h-4" /> Add Transaction
          </Button>
        </div>

        
        <Card className="p-4 border-dashed bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Filter className="w-3 h-3" /> Search Category
              </label>
              <Input 
                placeholder="e.g. Food, Rent..." 
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Transactions</SelectItem>
                  <SelectItem value="INCOME">Income Only</SelectItem>
                  <SelectItem value="EXPENSE">Expense Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Transaction Date</label>
              <Input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <Button 
              variant="outline" 
              className="text-muted-foreground"
              onClick={() => { setCategoryInput(""); setType("ALL"); setDate(""); }}
            >
              Clear All
            </Button>
          </div>
          
          {isFetching && (
             <div className="flex items-center gap-2 mt-2 text-[10px] text-primary animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Updating results...
             </div>
          )}
        </Card>

        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${totalIncome.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-${totalExpense.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <p className="text-xs text-muted-foreground">Showing {data.length} results</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((record: any) => (
                  <TableRow key={record.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-muted-foreground">
                      {new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </TableCell>
                    <TableCell className="font-medium">{record.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal capitalize">{record.category}</Badge>
                    </TableCell>
                    <TableCell className={`font-semibold ${record.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                      {record.type === "INCOME" ? "+" : "-"}${Math.abs(record.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={record.type === "INCOME" ? "secondary" : "destructive"} className="uppercase text-[10px]">
                        {record.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-lg font-semibold text-muted-foreground">No records found</p>
                        <p className="text-sm text-muted-foreground/60">Try adjusting your filters or adding a new entry.</p>
                      </div>
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