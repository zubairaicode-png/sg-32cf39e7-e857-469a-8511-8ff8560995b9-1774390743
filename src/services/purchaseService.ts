import { supabase } from "@/integrations/supabase/client";
import type { PurchaseInvoice, PurchaseInvoiceItem } from "@/types";

export const purchaseService = {
  async getAll(): Promise<PurchaseInvoice[]> {
    const { data, error } = await supabase
      .from("purchase_invoices")
      .select(`
        *,
        supplier:suppliers(id, code, name_english, name_arabic),
        items:purchase_invoice_items(*)
      `)
      .order("created_at", { ascending: false });

    console.log("Purchase invoices query:", { data, error });
    if (error) throw error;

    return (data || []).map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      supplierId: invoice.supplier_id,
      supplier: invoice.supplier ? {
        id: invoice.supplier.id,
        code: invoice.supplier.code,
        nameEnglish: invoice.supplier.name_english,
        nameArabic: invoice.supplier.name_arabic,
      } : undefined,
      date: invoice.date,
      dueDate: invoice.due_date,
      subtotal: invoice.subtotal,
      vatAmount: invoice.vat_amount,
      total: invoice.total,
      status: invoice.status as PurchaseInvoice["status"],
      notes: invoice.notes || undefined,
      items: Array.isArray(invoice.items) ? invoice.items.map((item: any) => ({
        id: item.id,
        itemName: item.item_name,
        description: item.description || undefined,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        vatRate: item.vat_rate,
        vatAmount: item.vat_amount,
        total: item.total,
      })) : [],
      createdAt: invoice.created_at,
    }));
  },

  async getById(id: string): Promise<PurchaseInvoice | null> {
    const { data, error } = await supabase
      .from("purchase_invoices")
      .select(`
        *,
        supplier:suppliers(id, code, name_english, name_arabic),
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
      supplier: data.supplier ? {
        id: data.supplier.id,
        code: data.supplier.code,
        nameEnglish: data.supplier.name_english,
        nameArabic: data.supplier.name_arabic,
      } : undefined,
      date: data.date,
      dueDate: data.due_date,
      subtotal: data.subtotal,
      vatAmount: data.vat_amount,
      total: data.total,
      status: data.status as PurchaseInvoice["status"],
      notes: data.notes || undefined,
      items: Array.isArray(data.items) ? data.items.map((item: any) => ({
        id: item.id,
        itemName: item.item_name,
        description: item.description || undefined,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        vatRate: item.vat_rate,
        vatAmount: item.vat_amount,
        total: item.total,
      })) : [],
      createdAt: data.created_at,
    };
  },

  async create(invoice: Omit<PurchaseInvoice, "id" | "createdAt" | "supplier">, items: Omit<PurchaseInvoiceItem, "id">[]): Promise<PurchaseInvoice> {
    // Insert invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("purchase_invoices")
      .insert({
        invoice_number: invoice.invoiceNumber,
        supplier_id: invoice.supplierId,
        date: invoice.date,
        due_date: invoice.dueDate,
        subtotal: invoice.subtotal,
        vat_amount: invoice.vatAmount,
        total: invoice.total,
        status: invoice.status,
        notes: invoice.notes,
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Insert items
    const itemsToInsert = items.map(item => ({
      invoice_id: invoiceData.id,
      item_name: item.itemName,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      vat_rate: item.vatRate,
      vat_amount: item.vatAmount,
      total: item.total,
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