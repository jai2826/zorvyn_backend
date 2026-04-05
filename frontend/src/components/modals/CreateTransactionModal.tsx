import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import api from "../../api/axios";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useAuth } from "../../context/AuthContext";
import type {
  CreateTransactionError,
  CreateTransactionSchema,
} from "../../lib/api_types";

const transactionSchema = z.object({
  description: z
    .string()
    .min(3, "Description is too short"),
  amount: z
    .number()
    .min(1, "Amount must be greater than 0"),

  category: z.string().min(2, "Category is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.string(),
});

type TransactionValues = z.infer<typeof transactionSchema>;

export function CreateTransactionModal({
  isOpen,
  onClose,
  Id,
}: {
  isOpen: boolean;
  onClose: () => void;
  Id?: string;
}) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient(); 

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const userId = Id ?? currentUser?.id;

  
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: CreateTransactionSchema) => {
      return await api.post(
        `/transactions/create/${userId}`,
        values,
      );
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({
        queryKey: ["userAnalyticsSummary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["companyAnalyticsSummary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["userTransactions", userId],
      });

      
      toast.success("Transaction recorded!");
      reset();
      onClose();
    },
    onError: (err: any) => {
      const serverError = err?.response
        ?.data as CreateTransactionError;
      const errorMessage =
        serverError?.error ||
        "Failed to save transaction. Please try again.";
      toast.error(errorMessage);
      setError("root", { message: errorMessage });
    },
  });

  const onSubmit = (values: TransactionValues) => {
    mutate(values);
  };

  
  if (currentUser?.role === "VIEWER") {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XIcon className="h-5 w-5" />
              Access Denied
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            You do not have the required permissions to
            record financial data.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="Rent, Salary, Groceries..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                {...register("amount", {
                  valueAsNumber: true,
                })}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                onValueChange={(val) =>
                  setValue("type", val as any)
                }
                defaultValue="EXPENSE">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">
                    Income
                  </SelectItem>
                  <SelectItem value="EXPENSE">
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              placeholder="Food, Utilities, etc."
              {...register("category")}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              {...register("date")}
            />
          </div>

          {errors.root && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive text-center">
                {errors.root.message}
              </p>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}>
              {isPending ? "Saving..." : "Save Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
