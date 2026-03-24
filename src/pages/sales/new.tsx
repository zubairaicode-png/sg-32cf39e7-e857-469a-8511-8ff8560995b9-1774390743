import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Customer, InvoiceItem } from "@/types";
import { customerService } from "@/services/customerService";
import { salesService } from "@/services/salesService";

export default function NewSalesInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    invoiceType: "standard",
    customerId: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", itemName: "", description: "", quantity: 1, unitPrice: 0, vatRate: 15, vatAmount: 0, totalAmount: 0 },
  ]);

  useEffect(() => {
    customerService.getAll().then(setCustomers).catch(console.error);
  }, []);

  const calculateLineItem = (item: InvoiceItem): InvoiceItem => {
    const subtotal = item.quantity * item.unitPrice;
    const vatAmount = subtotal * (item.vatRate / 100);
    const totalAmount = subtotal + vatAmount;
    return { ...item, vatAmount, totalAmount };
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index] = calculateLineItem(newItems[index]);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), itemName: "", description: "", quantity: 1, unitPrice: 0, vatRate: 15, vatAmount: 0, totalAmount: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalVat = items.reduce((sum, item) => sum + item.vatAmount, 0);
  const grandTotal = subtotal + totalVat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      toast({ title: "Error", description: "Please select a customer", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);

    try {
      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      
      await salesService.create({
        invoiceNumber: `INV-${Date.now()}`,
        invoiceType: formData.invoiceType as any,
        customerId: formData.customerId,
        customerName: selectedCustomer?.nameEnglish || "",
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        subtotal,
        vatAmount: totalVat,
        totalAmount: grandTotal,
        status: "draft",
        items: [],
        notes: "",
        createdBy: user?.id || "system",
      }, items.map(item => ({
        itemName: item.description || "Item", // Fallback to description for item name
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatRate: item.vatRate,
        vatAmount: item.vatAmount,
        totalAmount: item.totalAmount
      })));

      toast({
        title: "Sales Invoice Created",
        description: "Invoice has been created and submitted to ZATCA for clearance.",
      });
      router.push("/sales");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create sales invoice.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Sales Invoice - Maka ERP" />
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/sales">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Sales Invoice</h1>
              <p className="text-muted-foreground mt-1">ZATCA Phase 2 E-Invoicing Compliant</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Invoice Type *</Label>
                    <Select value={formData.invoiceType} onValueChange={(v) => setFormData({ ...formData, invoiceType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Invoice (B2B)</SelectItem>
                        <SelectItem value="simplified">Simplified Invoice (B2C)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Customer *</Label>
                    <Select value={formData.customerId} onValueChange={(v) => setFormData({ ...formData, customerId: v })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nameEnglish}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Invoice Date *</Label>
                    <Input type="date" value={formData.invoiceDate} onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Invoice Items</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead className="w-[100px]">Qty</TableHead>
                      <TableHead className="w-[120px]">Unit Price</TableHead>
                      <TableHead className="w-[100px]">VAT %</TableHead>
                      <TableHead className="w-[120px]">VAT Amount</TableHead>
                      <TableHead className="w-[120px]">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 1)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Select value={item.vatRate.toString()} onValueChange={(v) => handleItemChange(index, "vatRate", parseFloat(v))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="15">15%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="font-semibold">{item.vatAmount.toFixed(2)}</TableCell>
                        <TableCell className="font-bold">{item.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} disabled={items.length === 1}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-semibold">SAR {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total VAT:</span>
                      <span className="font-semibold">SAR {totalVat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Grand Total:</span>
                      <span className="text-primary">SAR {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="w-4 h-4" />
                {isLoading ? "Creating..." : "Create & Submit to ZATCA"}
              </Button>
              <Link href="/sales">
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