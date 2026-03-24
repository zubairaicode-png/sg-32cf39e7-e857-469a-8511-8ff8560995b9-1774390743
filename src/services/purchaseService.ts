import { supabase } from "@/integrations/supabase/client";
import type { PurchaseInvoice, PurchaseInvoiceItem } from "@/types";

export const purchaseService = {
  async getAll(): Promise<PurchaseInvoice[]> {
    const { data, error } = await supabase
      .from("purchase_invoices")
      .select(`
        *,
        supplier:suppliers(id, supplier_code, name_english, name_arabic),
        items:purchase_invoice_items(*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      supplierId: invoice.supplier_id,
      supplierName: invoice.supplier?.name_english || invoice.supplier_name || "",
      invoiceDate: invoice.invoice_date,
      dueDate: invoice.due_date || "",
      subtotal: invoice.subtotal,
      vatAmount: invoice.vat_amount || 0,
      totalAmount: invoice.total_amount,
      status: invoice.status as PurchaseInvoice["status"],
      notes: invoice.notes || undefined,
      createdBy: invoice.created_by || "",
      createdAt: invoice.created_at || new Date().toISOString(),
      items: Array.isArray(invoice.items) ? invoice.items.map((item: any) => ({
        id: item.id,
        itemName: item.item_description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        vatRate: item.vat_rate || 15,
        vatAmount: item.vat_amount || 0,
        totalAmount: item.total,
      })) : [],
    }));
  },

  async getById(id: string): Promise<PurchaseInvoice | null> {
    const { data, error } = await supabase
      .from("purchase_invoices")
      .select(`
        *,
        supplier:suppliers(id, supplier_code, name_english, name_arabic),
        items:purchase_invoice_items(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      invoiceNumber: data.invoice_number,
      supplierId: data.supplier_id,
      supplierName: data.supplier?.name_english || data.supplier_name || "",
      invoiceDate: data.invoice_date,
      dueDate: data.due_date || "",
      subtotal: data.subtotal,
      vatAmount: data.vat_amount || 0,
      totalAmount: data.total_amount,
      status: data.status as PurchaseInvoice["status"],
      notes: data.notes || undefined,
      createdBy: data.created_by || "",
      createdAt: data.created_at || new Date().toISOString(),
      items: Array.isArray(data.items) ? data.items.map((item: any) => ({
        id: item.id,
        itemName: item.item_description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        vatRate: item.vat_rate || 15,
        vatAmount: item.vat_amount || 0,
        totalAmount: item.total,
      })) : [],
    };
  },

  async create(invoice: Omit<PurchaseInvoice, "id" | "createdAt">, items: Omit<PurchaseInvoiceItem, "id">[]): Promise<PurchaseInvoice> {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("purchase_invoices")
      .insert({
        invoice_number: invoice.invoiceNumber,
        supplier_id: invoice.supplierId,
        supplier_name: invoice.supplierName,
        invoice_date: invoice.invoiceDate,
        due_date: invoice.dueDate,
        subtotal: invoice.subtotal,
        vat_amount: invoice.vatAmount,
        total_amount: invoice.totalAmount,
        status: invoice.status as any,
        notes: invoice.notes,
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    const itemsToInsert = items.map(item => ({
      invoice_id: invoiceData.id,
      item_description: item.itemName + (item.description ? ` - ${item.description}` : ""),
      quantity: item.quantity,
      unit_price: item.unitPrice,
      vat_rate: item.vatRate,
      vat_amount: item.vatAmount,
      total: item.totalAmount,
    }));

    const { error: itemsError } = await supabase
      .from("purchase_invoice_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return this.getById(invoiceData.id) as Promise<PurchaseInvoice>;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("purchase_invoices")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};