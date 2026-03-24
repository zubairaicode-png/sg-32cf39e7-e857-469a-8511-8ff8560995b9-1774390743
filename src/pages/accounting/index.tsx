import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, BookOpen } from "lucide-react";
import type { Account } from "@/types";

export default function AccountingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setAccounts([
      { id: "1", accountCode: "1000", accountName: "Cash in Bank", accountType: "asset", isActive: true, balance: 250000, debitBalance: 250000, creditBalance: 0 },
      { id: "2", accountCode: "1200", accountName: "Accounts Receivable", accountType: "asset", isActive: true, balance: 45000, debitBalance: 45000, creditBalance: 0 },
      { id: "3", accountCode: "2000", accountName: "Accounts Payable", accountType: "liability", isActive: true, balance: -25000, debitBalance: 0, creditBalance: 25000 },
      { id: "4", accountCode: "4000", accountName: "Sales Revenue", accountType: "revenue", isActive: true, balance: -150000, debitBalance: 0, creditBalance: 150000 },
    ]);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <>
      <SEO title="Accounting - Maka ERP" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Chart of Accounts</h1>
              <p className="text-muted-foreground mt-1">Double entry accounting system</p>
            </div>
            <div className="flex gap-2">
              <Link href="/accounting/journal/new">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  New Journal Entry
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardHeader><CardTitle>Accounts</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map(acc => (
                    <TableRow key={acc.id}>
                      <TableCell className="font-medium">{acc.accountCode}</TableCell>
                      <TableCell>{acc.accountName}</TableCell>
                      <TableCell className="capitalize">{acc.accountType}</TableCell>
                      <TableCell className="text-right">{acc.debitBalance > 0 ? acc.debitBalance.toLocaleString() : '-'}</TableCell>
                      <TableCell className="text-right">{acc.creditBalance > 0 ? acc.creditBalance.toLocaleString() : '-'}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {Math.abs(acc.balance).toLocaleString()} {acc.balance < 0 ? 'CR' : 'DR'}
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