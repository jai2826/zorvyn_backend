import {
  LayoutDashboard,
  LibraryBigIcon,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Navbar() {
  const { role, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 px-4 max-w-7xl mx-auto">
        {}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-xl tracking-tight mr-6">
          <div className="bg-primary text-primary-foreground p-1 rounded">
            ZV
          </div>
          <span>Zorvyn</span>
        </Link>

        
        <div className="flex  items-center space-x-1 md:space-x-4 flex-1">
          <Link
            to="/dashboard"
            className=" transition-colors hover:text-primary flex items-center gap-1">
            <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-lg font-medium md:font-semibold">
              Dashboard
            </span>
          </Link>

          
          {role === "ADMIN" && (
            <Link
              to="/admin"
              className=" transition-colors hover:text-primary flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-lg font-medium md:font-semibold">
                Admin Panel
              </span>
            </Link>
          )}
          {role !== "VIEWER" && (
            <Link
              to="/analyst"
              className=" transition-colors hover:text-primary flex items-center gap-1">
              <LibraryBigIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-lg font-medium md:font-semibold">
                Audit & Analyze
              </span>
            </Link>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full bg-muted">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="end"
              forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Logged in as {role?.toLowerCase()}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              {role === "ADMIN" && (
                <DropdownMenuItem
                  onClick={() => navigate("/admin")}>
                  Admin Settings
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
