import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";
import type { Supplier, LedgerEntry } from "@/types";
import { supplierService } from "@/services/supplierService";
import { supabase } from "@/integrations/supabase/client";

export default function SupplierLedgerPage() {
  const router = useRouter();
  const { id } = router.query;
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const supplierId = Array.isArray(id) ? id[0] : id;
      const fetchData = async () => {
        try {
          const supplierData = await supplierService.getById(supplierId);
          setSupplier(supplierData);

          const { data: ledgerData, error } = await supabase
            .from('ledger_entries')
            .select('*')
            .eq('supplier_id', supplierId)
            .order('entry_date', { ascending: true });

          if (!error && ledgerData) {
            setLedger(ledgerData.map(entry => ({
              id: entry.id,
              date: entry.entry_date,
              referenceType: entry.transaction_type,
              referenceNumber: entry.reference_number,
              description: entry.description,
              debit: entry.debit || 0,
              credit: entry.credit || 0,
              balance: entry.balance || 0,
            })));
          }
        } catch (error) {
          console.error("Error fetching ledger:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!supplier) return null;

  const totalDebit = ledger.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = ledger.reduce((sum, entry) => sum + entry.credit, 0);
  const currentBalance = totalCredit - totalDebit;

  return (
    <>
      <SEO title={`${supplier.nameEnglish} - Supplier Ledger`} />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/suppliers">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Supplier Ledger</h1>
                <p className="text-muted-foreground mt-1">{supplier.nameEnglish}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier Code</p>
                  <p className="font-semibold">{supplier.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VAT Number</p>
                  <p className="font-semibold">{supplier.vatNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p className="font-semibold">{supplier.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-semibold">{supplier.phone || supplier.email || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">SAR {totalDebit.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">SAR {totalCredit.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentBalance > 0 ? "text-destructive" : "text-success"}`}>
                  SAR {Math.abs(currentBalance).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentBalance > 0 ? "Payable" : "Advance Payment"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledger.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded bg-muted">{entry.referenceType}</span>
                      </TableCell>
                      <TableCell className="font-medium">{entry.referenceNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        {entry.debit > 0 ? `SAR ${entry.debit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        {entry.credit > 0 ? `SAR ${entry.credit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-bold">SAR {Math.abs(entry.balance).toLocaleString()}</TableCell>
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