import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, FileText } from "lucide-react";
import type { Customer } from "@/types";

export default function CustomersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // Mock data - replace with API call
    setCustomers([
      {
        id: "1",
        customerCode: "CUST-001",
        nameEnglish: "Al-Rajhi Trading Company",
        nameArabic: "شركة الراجحي التجارية",
        vatNumber: "300075588900003",
        crNumber: "1010123456",
        buildingNumber: "1234",
        streetName: "King Fahd Road",
        district: "Al Olaya",
        city: "Riyadh",
        postalCode: "12211",
        additionalNumber: "5678",
        countryCode: "SA",
        email: "info@alrajhi-trading.sa",
        phone: "+966501234567",
        contactPerson: "Ahmed Al-Rajhi",
        creditLimit: 100000,
        paymentTerms: 30,
        isActive: true,
        createdAt: "2024-01-15T00:00:00Z",
        balance: 45000,
      },
      {
        id: "2",
        customerCode: "CUST-002",
        nameEnglish: "Saudi Telecom Company",
        nameArabic: "شركة الاتصالات السعودية",
        vatNumber: "300075588900004",
        crNumber: "1010234567",
        buildingNumber: "5678",
        streetName: "Prince Mohammed Bin Abdulaziz Road",
        district: "Al Muruj",
        city: "Riyadh",
        postalCode: "11564",
        additionalNumber: "9012",
        countryCode: "SA",
        email: "procurement@stc.sa",
        phone: "+966502345678",
        contactPerson: "Khalid Al-Otaibi",
        creditLimit: 200000,
        paymentTerms: 45,
        isActive: true,
        createdAt: "2024-02-01T00:00:00Z",
        balance: 125000,
      },
    ]);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredCustomers = customers.filter((customer) =>
    customer.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.vatNumber && customer.vatNumber.includes(searchQuery))
  );

  return (
    <>
      <SEO title="Customers - Maka ERP System" />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-muted-foreground mt-1">Manage your customer database</p>
            </div>
            <Link href="/customers/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customers.filter((c) => c.isActive).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Receivables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  SAR {customers.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Credit Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  SAR {customers.reduce((sum, c) => sum + c.creditLimit, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, code, or VAT number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>VAT Number</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.nameEnglish}</p>
                          <p className="text-sm text-muted-foreground">{customer.nameArabic}</p>
                        </div>
                      </TableCell>
                      <TableCell>{customer.vatNumber}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{customer.phone}</p>
                          <p className="text-muted-foreground">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        SAR {customer.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.isActive ? "default" : "secondary"}>
                          {customer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Link href={`/customers/${customer.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/customers/${customer.id}/ledger`}>
                            <Button variant="ghost" size="icon" title="View Ledger">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </Link>
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