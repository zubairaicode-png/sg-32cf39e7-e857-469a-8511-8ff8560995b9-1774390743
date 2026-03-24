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
import { Plus, Search, FileText, Download } from "lucide-react";
import type { SalesInvoice } from "@/types";

export default function SalesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    setInvoices([
      {
        id: "1",
        invoiceNumber: "INV-2024-001",
        invoiceType: "standard",
        customerId: "1",
        customerName: "Al-Rajhi Trading Company",
        invoiceDate: "2024-03-24",
        dueDate: "2024-04-23",
        items: [],
        subtotal: 10000,
        vatAmount: 1500,
        totalAmount: 11500,
        status: "issued",
        zatcaStatus: "approved",
        createdBy: "admin",
        createdAt: "2024-03-24T10:00:00Z",
      }
    ]);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <>
      <SEO title="Sales Invoices - Maka ERP System" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sales Invoices</h1>
              <p className="text-muted-foreground mt-1">Manage ZATCA compliant e-invoices</p>
            </div>
            <Link href="/sales/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search invoices..." className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount (SAR)</TableHead>
                    <TableHead>ZATCA Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                      <TableCell>{inv.customerName}</TableCell>
                      <TableCell>{inv.invoiceDate}</TableCell>
                      <TableCell className="capitalize">{inv.invoiceType}</TableCell>
                      <TableCell className="text-right font-semibold">{inv.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={inv.zatcaStatus === 'approved' ? 'text-success border-success' : ''}>
                          {inv.zatcaStatus?.replace('_', ' ').toUpperCase() || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{inv.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon"><FileText className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
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