import { useQuery } from "@tanstack/react-query"; // Import Hook
import {
  ArrowLeftIcon,
  DollarSign,
  PlusCircle,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../api/axios";
import { CreateTransactionModal } from "../../../components/modals/CreateTransactionModal";
import { DeleteModal } from "../../../components/modals/DeleteModal";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
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
import { useAuth } from "../../../context/AuthContext";
import type {
  Transaction,
  User,
} from "../../../lib/api_types";

export const UserDetailsPage = () => {
  const { token, user } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [
    isTransactionModalOpen,
    setIsTransactionModalOpen,
  ] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- TANSTACK QUERY REPLACES USEEFFECT ---
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery<User>({
    queryKey: ["userTransactions", userId], // Unique key for caching and refetching
    queryFn: async () => {
      // Logic Fix: Ensure you pass userId to the backend to see THAT user's data
      const res = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token && !!userId, // Don't run until we have values
  });

  // Delete Transaction
  const openDeleteConfirm = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  // 2. The actual API call
  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);

    try {
      await api.delete(
        `/transactions/delete/${transactionToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Transaction permanently deleted");
      // Update local state so the row disappears immediately
      refetch();
    } catch (err) {
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  // Extract data from response safely
  const records = response?.Transactions || [];
  // If your backend returns { records, email }, adjust to: response?.records || []

  // // --- STATS CALCULATION ---
  const totalIncome = records
    .filter((r: any) => r.type === "INCOME")
    .reduce((acc: number, r: any) => acc + r.amount, 0);
  const totalExpense = records
    .filter((r: any) => r.type === "EXPENSE")
    .reduce((acc: number, r: any) => acc + r.amount, 0);
  const balance = totalIncome - totalExpense;

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
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
        Id={userId} // Passing the target userId to the modal
      />

      <div className="space-y-8 px-0 mx-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl flex flex-row gap-1 items-center font-bold tracking-tight">
              <ArrowLeftIcon onClick={()=>{
                navigate("/admin")
              }} size={24} className="border-black rounded-md border-2 cursor-pointer"/>
              Overview
            </h2>
            <p className="text-muted-foreground">
              Monitoring cash flow for{" "}
              <span className="font-semibold text-primary">
                {response?.email}
              </span>
            </p>
          </div>

          <Button
            className="flex gap-2"
            onClick={() => setIsTransactionModalOpen(true)}>
            <PlusCircle className="w-4 h-4" /> Add
            Transaction
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
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
          <Card>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -${totalExpense.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 self-center"
                        disabled={
                          user.role === "ADMIN"
                            ? false
                            : true
                        }
                        onClick={() => {
                          openDeleteConfirm(record);
                        }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
