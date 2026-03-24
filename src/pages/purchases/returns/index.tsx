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

interface PurchaseReturn {
  id: string;
  returnNumber: string;
  originalInvoiceNumber: string;
  supplierId: string;
  supplierName: string;
  returnDate: string;
  reason: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function PurchaseReturnsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    setReturns([
      {
        id: "1",
        returnNumber: "PRET-2024-001",
        originalInvoiceNumber: "PINV-2024-001",
        supplierId: "1",
        supplierName: "National Electronics",
        returnDate: "2024-03-22",
        reason: "Wrong specification",
        totalAmount: 5750,
        status: "processed",
        createdAt: "2024-03-22T10:00:00Z",
      },
    ]);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <>
      <SEO title="Purchase Returns - Maka ERP" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Purchase Returns</h1>
              <p className="text-muted-foreground mt-1">Manage supplier returns and debit notes</p>
            </div>
            <Link href="/purchases/returns/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Return
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search returns..." className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return No.</TableHead>
                    <TableHead>Original Invoice</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Amount (SAR)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returns.map((ret) => (
                    <TableRow key={ret.id}>
                      <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                      <TableCell>
                        <Link href={`/purchases/${ret.originalInvoiceNumber}`} className="text-primary hover:underline">
                          {ret.originalInvoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{ret.supplierName}</TableCell>
                      <TableCell>{ret.returnDate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{ret.reason}</TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        -{ret.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={ret.status === "processed" ? "default" : "secondary"}>
                          {ret.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
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