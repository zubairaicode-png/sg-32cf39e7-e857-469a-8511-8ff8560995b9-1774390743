import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, Permission } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALL_PERMISSIONS: Permission[] = [
  "manage_users",
  "view_customers",
  "manage_customers",
  "view_suppliers",
  "manage_suppliers",
  "create_sales_invoice",
  "view_sales",
  "create_purchase_invoice",
  "view_purchases",
  "manage_accounting",
  "view_reports"
];

const DEMO_USERS: Record<string, User> = {
  admin: {
    id: "1",
    username: "admin",
    email: "admin@company.sa",
    fullName: "System Administrator",
    role: "admin",
    permissions: ALL_PERMISSIONS,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  accountant: {
    id: "2",
    username: "accountant",
    email: "accountant@company.sa",
    fullName: "Senior Accountant",
    role: "accountant",
    permissions: [
      "view_customers",
      "view_suppliers",
      "view_sales",
      "view_purchases",
      "manage_accounting",
      "view_reports",
    ],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("erp_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (password === "demo123" && DEMO_USERS[username]) {
      const loggedInUser = {
        ...DEMO_USERS[username],
        lastLogin: new Date().toISOString(),
      };
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem("erp_user", JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("erp_user");
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}