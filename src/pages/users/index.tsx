import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Lock, Unlock } from "lucide-react";
import type { User } from "@/types";

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    setUsers([
      {
        id: "1",
        username: "admin",
        email: "admin@maka-erp.com",
        fullName: "System Administrator",
        role: "admin",
        permissions: [
          "manage_users", "view_customers", "manage_customers", 
          "view_suppliers", "manage_suppliers", "create_sales_invoice", 
          "view_sales", "create_purchase_invoice", "view_purchases", 
          "manage_accounting", "view_reports"
        ],
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        username: "accountant",
        email: "accountant@maka-erp.com",
        fullName: "Mohammed Al-Harbi",
        role: "accountant",
        permissions: [
          "view_customers", "view_suppliers", "view_sales", 
          "view_purchases", "manage_accounting", "view_reports"
        ],
        isActive: true,
        createdAt: "2024-02-15T00:00:00Z",
      },
      {
        id: "3",
        username: "sales",
        email: "sales@maka-erp.com",
        fullName: "Fatima Al-Qahtani",
        role: "sales",
        permissions: [
          "view_customers", "create_sales_invoice", 
          "view_sales", "view_reports"
        ],
        isActive: true,
        createdAt: "2024-03-01T00:00:00Z",
      },
    ]);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const roleColors: Record<string, string> = {
    admin: "bg-destructive text-destructive-foreground",
    accountant: "bg-primary text-primary-foreground",
    sales: "bg-accent text-accent-foreground",
    viewer: "bg-muted text-muted-foreground",
  };

  return (
    <>
      <SEO title="User Management - Maka ERP" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground mt-1">Manage system users and permissions</p>
            </div>
            <Link href="/users/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role]}>{user.role.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/users/${user.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Edit User">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" title={user.isActive ? "Deactivate" : "Activate"}>
                            {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}