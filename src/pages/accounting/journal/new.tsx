import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Account } from "@/types";

interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

export default function NewJournalEntryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    reference: "",
    description: "",
  });
  const [lines, setLines] = useState<JournalLine[]>([
    { id: "1", accountId: "", accountCode: "", accountName: "", description: "", debit: 0, credit: 0 },
    { id: "2", accountId: "", accountCode: "", accountName: "", description: "", debit: 0, credit: 0 },
  ]);

  useEffect(() => {
    setAccounts([
      { id: "1", accountCode: "1000", accountName: "Cash in Bank", accountType: "asset", isActive: true, balance: 250000, debitBalance: 250000, creditBalance: 0 },
      { id: "2", accountCode: "1200", accountName: "Accounts Receivable", accountType: "asset", isActive: true, balance: 45000, debitBalance: 45000, creditBalance: 0 },
      { id: "3", accountCode: "2000", accountName: "Accounts Payable", accountType: "liability", isActive: true, balance: -25000, debitBalance: 0, creditBalance: 25000 },
      { id: "4", accountCode: "4000", accountName: "Sales Revenue", accountType: "revenue", isActive: true, balance: -150000, debitBalance: 0, creditBalance: 150000 },
      { id: "5", accountCode: "5000", accountName: "Cost of Goods Sold", accountType: "expense", isActive: true, balance: 80000, debitBalance: 80000, creditBalance: 0 },
      { id: "6", accountCode: "2300", accountName: "VAT Payable", accountType: "liability", isActive: true, balance: -15000, debitBalance: 0, creditBalance: 15000 },
      { id: "7", accountCode: "1300", accountName: "VAT Receivable", accountType: "asset", isActive: true, balance: 10000, debitBalance: 10000, creditBalance: 0 },
    ]);
  }, []);

  const handleAccountChange = (index: number, accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    if (account) {
      const newLines = [...lines];
      newLines[index] = {
        ...newLines[index],
        accountId,
        accountCode: account.accountCode,
        accountName: account.accountName,
      };
      setLines(newLines);
    }
  };

  const handleLineChange = (index: number, field: keyof JournalLine, value: string | number) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    // Ensure only debit OR credit is filled
    if (field === "debit" && value > 0) {
      newLines[index].credit = 0;
    } else if (field === "credit" && value > 0) {
      newLines[index].debit = 0;
    }
    
    setLines(newLines);
  };

  const addLine = () => {
    setLines([
      ...lines,
      { id: Date.now().toString(), accountId: "", accountCode: "", accountName: "", description: "", debit: 0, credit: 0 },
    ]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBalanced) {
      toast({
        title: "Entry Not Balanced",
        description: "Total debits must equal total credits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast({
        title: "Journal Entry Posted",
        description: "Entry has been recorded in the general ledger.",
      });
      router.push("/accounting/journal");
    }, 1000);
  };

  return (
    <>
      <SEO title="New Journal Entry - Maka ERP" />
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/accounting/journal">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">New Journal Entry</h1>
              <p className="text-muted-foreground mt-1">Manual accounting entry</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Entry Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reference</Label>
                    <Input
                      placeholder="e.g., Payment voucher #123"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label>Description *</Label>
                    <Input
                      placeholder="Brief description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Journal Lines</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addLine}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Line
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Account</TableHead>
                      <TableHead className="w-[250px]">Description</TableHead>
                      <TableHead className="w-[150px]">Debit</TableHead>
                      <TableHead className="w-[150px]">Credit</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line, index) => (
                      <TableRow key={line.id}>
                        <TableCell>
                          <Select
                            value={line.accountId}
                            onValueChange={(v) => handleAccountChange(index, v)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((acc) => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  {acc.accountCode} - {acc.accountName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Line description"
                            value={line.description}
                            onChange={(e) => handleLineChange(index, "description", e.target.value)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.debit || ""}
                            onChange={(e) => handleLineChange(index, "debit", parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.credit || ""}
                            onChange={(e) => handleLineChange(index, "credit", parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLine(index)}
                            disabled={lines.length === 2}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 flex justify-end">
                  <div className="w-96 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Debit:</span>
                      <span className="font-semibold text-success">SAR {totalDebit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Credit:</span>
                      <span className="font-semibold text-destructive">SAR {totalCredit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Difference:</span>
                      <span className={isBalanced ? "text-success" : "text-destructive"}>
                        SAR {Math.abs(totalDebit - totalCredit).toFixed(2)}
                      </span>
                    </div>
                    {!isBalanced && totalDebit + totalCredit > 0 && (
                      <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Entry must be balanced to post</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isLoading || !isBalanced} className="gap-2">
                <Save className="w-4 h-4" />
                {isLoading ? "Posting..." : "Post Journal Entry"}
              </Button>
              <Link href="/accounting/journal">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
}