import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  DollarSign,
  Filter,
  Loader2,
  PlusCircle,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import api from "../../../api/axios";
import { CreateTransactionModal } from "../../../components/modals/CreateTransactionModal";
import { DeleteModal } from "../../../components/modals/DeleteModal";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useAuth } from "../../../context/AuthContext";
import type {
  Transaction,
  User,
} from "../../../lib/api_types";

export const UserDetailsPage = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- FILTER STATE ---
  const [categoryInput, setCategoryInput] = useState("");
  const [debouncedCategory] = useDebounce(
    categoryInput,
    500,
  );
  const [type, setType] = useState<string>("ALL");
  const [date, setDate] = useState<string>("");

  const [
    isTransactionModalOpen,
    setIsTransactionModalOpen,
  ] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  // --- QUERY: FETCH USER & FILTERED TRANSACTIONS ---
  const {
    data: response,
    isLoading,
    isError,
    isFetching,
  } = useQuery<User>({
    // queryKey depends on userId AND all filter values
    queryKey: [
      "userTransactions",
      userId,
      { category: debouncedCategory, type, date },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedCategory)
        params.append("category", debouncedCategory);
      if (type !== "ALL") params.append("type", type);
      if (date) params.append("date", date);

      const res = await api.get(
        `/users/${userId}?${params.toString()}`,
      );
      return res.data;
    },
    enabled: !!userId,
  });

  // --- MUTATION: DELETE TRANSACTION ---
  const {
    mutate: deleteTransaction,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/delete/${id}`);
    },
    onSuccess: () => {
      // Refresh the specific query for this user and their filters
      queryClient.invalidateQueries({
        queryKey: ["userTransactions", userId],
      });
      toast.success("Transaction permanently deleted");
      setIsDeleteModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
    }
  };

  const records = response?.Transactions || [];

  // Stats (calculated from filtered records)
  const totalIncome = records
    .filter((r: any) => r.type === "INCOME")
    .reduce((acc: number, r: any) => acc + r.amount, 0);
  const totalExpense = records
    .filter((r: any) => r.type === "EXPENSE")
    .reduce((acc: number, r: any) => acc + r.amount, 0);
  const balance = totalIncome - totalExpense;

  if (isLoading)
    return (
      <div className="flex justify-center p-20 animate-pulse">
        Loading Financial Data...
      </div>
    );
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Failed to load records.
      </div>
    );

  return (
    <>
      <CreateTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        Id={userId}
      />

      <div className="space-y-8 px-0 mx-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin")}
              className="rounded-full">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                User Overview
              </h2>
              <p className="text-muted-foreground">
                Monitoring cash flow for{" "}
                <span className="font-semibold text-primary">
                  {response?.email}
                </span>
              </p>
            </div>
          </div>

          <Button
            className="flex gap-2"
            onClick={() => setIsTransactionModalOpen(true)}>
            <PlusCircle className="w-4 h-4" /> Add
            Transaction
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

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${balance.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${totalIncome.toLocaleString()}
              </div>
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

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Filtered Transactions ({records.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(
                        record.date,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.description}
                    </TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell
                      className={
                        record.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }>
                      {record.type === "INCOME" ? "+" : "-"}
                      ${record.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.type === "INCOME"
                            ? "default"
                            : "destructive"
                        }>
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        disabled={
                          currentUser?.role !== "ADMIN"
                        }
                        onClick={() => {
                          setTransactionToDelete(record);
                          setIsDeleteModalOpen(true);
                        }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {records.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground">
                      No transactions found for this search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        variant="destructive"
        title="Delete Transaction"
        description={
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">
              {transactionToDelete?.description}
            </span>
            <span>
              Are you sure you want to delete this
              transaction? This action cannot be undone.
            </span>
          </div>
        }
      />
    </>
  );
};
