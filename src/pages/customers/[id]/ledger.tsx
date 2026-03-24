import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";
import type { Customer, LedgerEntry } from "@/types";
import { customerService } from "@/services/customerService";
import { supabase } from "@/integrations/supabase/client";

export default function CustomerLedgerPage() {
  const router = useRouter();
  const { id } = router.query;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const customerId = Array.isArray(id) ? id[0] : id;
      const fetchData = async () => {
        try {
          const customerData = await customerService.getById(customerId);
          setCustomer(customerData);

          const { data: ledgerData, error } = await supabase
            .from('ledger_entries')
            .select('*')
            .eq('customer_id', customerId)
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

  if (!customer) {
    return null;
  }

  const totalDebit = ledger.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = ledger.reduce((sum, entry) => sum + entry.credit, 0);
  const currentBalance = totalDebit - totalCredit;

  return (
    <>
      <SEO title={`${customer.nameEnglish} - Customer Ledger`} />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/customers">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Customer Ledger</h1>
                <p className="text-muted-foreground mt-1">{customer.nameEnglish}</p>
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

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Code</p>
                  <p className="font-semibold">{customer.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VAT Number</p>
                  <p className="font-semibold">{customer.vatNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credit Limit</p>
                  <p className="font-semibold">SAR {customer.creditLimit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p className="font-semibold">{customer.paymentTerms} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Debit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  SAR {totalDebit.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  SAR {totalCredit.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentBalance > 0 ? "text-destructive" : "text-success"}`}>
                  SAR {Math.abs(currentBalance).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentBalance > 0 ? "Receivable" : "Advance"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Available Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  SAR {(customer.creditLimit - currentBalance).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ledger Table */}
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
                        <span className="text-xs px-2 py-1 rounded bg-muted">
                          {entry.referenceType}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{entry.referenceNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        {entry.debit > 0 ? `SAR ${entry.debit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        {entry.credit > 0 ? `SAR ${entry.credit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        SAR {entry.balance.toLocaleString()}
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