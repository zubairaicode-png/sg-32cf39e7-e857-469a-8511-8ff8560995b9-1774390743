import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Truck, FileText, ShoppingCart, TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: "Total Sales",
      value: "SAR 156,240",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Total Purchases",
      value: "SAR 98,450",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-primary",
    },
    {
      title: "Active Customers",
      value: "248",
      change: "+18",
      trend: "up",
      icon: Users,
      color: "text-accent",
    },
    {
      title: "Active Suppliers",
      value: "87",
      change: "+5",
      trend: "up",
      icon: Truck,
      color: "text-secondary",
    },
  ];

  const recentInvoices = [
    { id: "INV-2024-001", customer: "Al-Rajhi Company", amount: 15000, status: "Paid", date: "2024-03-20" },
    { id: "INV-2024-002", customer: "Saudi Telecom", amount: 28500, status: "Pending", date: "2024-03-22" },
    { id: "INV-2024-003", customer: "SABIC Industries", amount: 45000, status: "Paid", date: "2024-03-23" },
  ];

  return (
    <>
      <SEO title="Dashboard - Maka ERP System" />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your ERP control center</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                      {stat.change}
                    </span>
                    {" "}from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">SAR {invoice.amount.toLocaleString()}</p>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded",
                            invoice.status === "Paid"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          )}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Create Sales Invoice</p>
                      <p className="text-sm text-muted-foreground">Issue new ZATCA compliant invoice</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Record Purchase</p>
                      <p className="text-sm text-muted-foreground">Add new purchase invoice</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Add Customer</p>
                      <p className="text-sm text-muted-foreground">Register new customer</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}