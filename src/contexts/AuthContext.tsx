import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User, Permission } from "@/types";

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

// Demo user mapping for development
const DEMO_USERS: Record<string, { email: string; password: string; role: string; fullName: string; permissions: Permission[] }> = {
  admin: {
    email: "admin@erp.local",
    password: "demo123",
    role: "admin",
    fullName: "System Administrator",
    permissions: ALL_PERMISSIONS,
  },
  accountant: {
    email: "accountant@erp.local",
    password: "demo123",
    role: "accountant",
    fullName: "Senior Accountant",
    permissions: [
      "view_customers",
      "view_suppliers",
      "view_sales",
      "view_purchases",
      "manage_accounting",
      "view_reports",
    ],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Fetch user details from users table
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (userData) {
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          fullName: userData.full_name,
          role: userData.role,
          permissions: userData.permissions || [],
          isActive: userData.is_active,
          createdAt: userData.created_at,
        });
        setIsAuthenticated(true);
      }
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check if it's a demo user
      const demoUser = DEMO_USERS[username];
      
      if (demoUser && password === demoUser.password) {
        // Sign in with demo user credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email: demoUser.email,
          password: demoUser.password,
        });

        if (error) {
          // If demo user doesn't exist in auth, create them
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: demoUser.email,
            password: demoUser.password,
          });

          if (signUpError) {
            console.error("Sign up error:", signUpError);
            return false;
          }

          // Create user record in users table
          if (signUpData.user) {
            await supabase.from("users").insert({
              id: signUpData.user.id,
              username: username,
              email: demoUser.email,
              full_name: demoUser.fullName,
              role: demoUser.role,
              permissions: demoUser.permissions,
              is_active: true,
            });
          }

          // Now try to sign in again
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: demoUser.email,
            password: demoUser.password,
          });

          if (retryError || !retryData.user) {
            console.error("Retry sign in error:", retryError);
            return false;
          }

          data.user = retryData.user;
        }

        if (data.user) {
          const loggedInUser: User = {
            id: data.user.id,
            username: username,
            email: demoUser.email,
            fullName: demoUser.fullName,
            role: demoUser.role,
            permissions: demoUser.permissions,
            isActive: true,
            createdAt: new Date().toISOString(),
          };

          setUser(loggedInUser);
          setIsAuthenticated(true);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
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