import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query"; // Import Mutation
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

import api from "../../api/axios";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";
import type { LoginErrorResponse, LoginResponse } from "../../lib/api_types";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthValues = z.infer<typeof authSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
  });

  // --- TANSTACK MUTATION ---
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: AuthValues) => {
      const res = await api.post("/auth/login", values);
      return res.data;
    },
    onSuccess: (data:LoginResponse) => {
      // 1. Update Auth Context
      login(data.token, data.user.role);
      
      // 2. Feedback & Navigation
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    },
    onError: (err: any) => {
      const serverError = err.response.data as LoginErrorResponse
      const errorMessage = serverError.error || "Login failed. Please try again.";
      setError("root", { message: errorMessage });
      toast.error(errorMessage);
    }
  });

  const onSubmit = (values: AuthValues) => {
    mutate(values); // Trigger the mutation
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              {...register("email")} 
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              {...register("password")} 
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive text-center">{errors.root.message}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Verifying..." : "Login"}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground mt-2">
            Don't have an account? <Link to="/signup" className="underline">Sign Up</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}