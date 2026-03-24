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

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  reference: string;
  totalDebit: number;
  totalCredit: number;
  status: string;
  createdBy: string;
  createdAt: string;
}

export default function JournalEntriesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    setEntries([
      {
        id: "1",
        entryNumber: "JE-2024-001",
        date: "2024-03-24",
        description: "Opening balances",
        reference: "SYS-INIT",
        totalDebit: 295000,
        totalCredit: 295000,
        status: "posted",
        createdBy: "admin",
        createdAt: "2024-03-24T10:00:00Z",
      },
      {
        id: "2",
        entryNumber: "JE-2024-002",
        date: "2024-03-24",
        description: "Sales invoice - INV-2024-001",
        reference: "INV-2024-001",
        totalDebit: 11500,
        totalCredit: 11500,
        status: "posted",
        createdBy: "admin",
        createdAt: "2024-03-24T11:30:00Z",
      },
    ]);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <>
      <SEO title="Journal Entries - Maka ERP" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Journal Entries</h1>
              <p className="text-muted-foreground mt-1">Double-entry accounting system</p>
            </div>
            <Link href="/accounting/journal/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Journal Entry
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search journal entries..." className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.entryNumber}</TableCell>
                      <TableCell>{new Date(entry.date).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.reference}</TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        SAR {entry.totalDebit.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        SAR {entry.totalCredit.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.status === "posted" ? "default" : "secondary"}>
                          {entry.status.toUpperCase()}
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