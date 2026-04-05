import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Use the hook instead of window.location
import type { User } from "../lib/api_types";

// Define a proper interface instead of 'any'
interface AuthContextType {
  token: string | null;
  user: User | null;
  role: string | undefined;
  login: (newToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use useCallback to prevent unnecessary re-renders or infinite loops
  const logout = useCallback(() => {
    localStorage.removeItem('token'); // Only remove what we own
    setToken(null);
    setUser(null);
    // Use React Router for navigation to stay within the SPA context
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const checkAuth = () => {
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            logout();
          } else {
            // Ensure we cast the decoded token to your User type
            setUser(decoded as User);
          }
        } catch (error) {
          console.error("Invalid token", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, logout]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Navigating to dashboard happens in the LoginForm onSuccess usually, 
    // but the token update triggers the useEffect above.
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      role: user?.role, 
      login, 
      logout, 
      isAuthenticated: !!token,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};