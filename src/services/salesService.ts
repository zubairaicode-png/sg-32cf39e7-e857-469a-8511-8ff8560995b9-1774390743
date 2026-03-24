import { supabase } from "@/integrations/supabase/client";
import type { SalesInvoice, SalesInvoiceItem } from "@/types";

export const salesService = {
  async getAll(): Promise<SalesInvoice[]> {
    const { data, error } = await supabase
      .from("sales_invoices")
      .select(`
        *,
        customer:customers(id, code, name_english, name_arabic),
        items:sales_invoice_items(*)
      `)
      .order("created_at", { ascending: false });

    console.log("Sales invoices query:", { data, error });
    if (error) throw error;

    return (data || []).map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      invoiceType: invoice.invoice_type as SalesInvoice["invoiceType"],
      customerId: invoice.customer_id,
      customer: invoice.customer ? {
        id: invoice.customer.id,
        code: invoice.customer.code,
        nameEnglish: invoice.customer.name_english,
        nameArabic: invoice.customer.name_arabic,
      } : undefined,
      date: invoice.date,
      dueDate: invoice.due_date,
      subtotal: invoice.subtotal,
      vatAmount: invoice.vat_amount,
      total: invoice.total,
      status: invoice.status as SalesInvoice["status"],
      notes: invoice.notes || undefined,
      qrCode: invoice.qr_code || undefined,
      zatcaUuid: invoice.zatca_uuid || undefined,
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

  async getById(id: string): Promise<SalesInvoice | null> {
    const { data, error } = await supabase
      .from("sales_invoices")
      .select(`
        *,
        customer:customers(id, code, name_english, name_arabic),
        items:sales_invoice_items(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      invoiceNumber: data.invoice_number,
      invoiceType: data.invoice_type as SalesInvoice["invoiceType"],
      customerId: data.customer_id,
      customer: data.customer ? {
        id: data.customer.id,
        code: data.customer.code,
        nameEnglish: data.customer.name_english,
        nameArabic: data.customer.name_arabic,
      } : undefined,
      date: data.date,
      dueDate: data.due_date,
      subtotal: data.subtotal,
      vatAmount: data.vat_amount,
      total: data.total,
      status: data.status as SalesInvoice["status"],
      notes: data.notes || undefined,
      qrCode: data.qr_code || undefined,
      zatcaUuid: data.zatca_uuid || undefined,
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

  async create(invoice: Omit<SalesInvoice, "id" | "createdAt" | "customer">, items: Omit<SalesInvoiceItem, "id">[]): Promise<SalesInvoice> {
    // Insert invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("sales_invoices")
      .insert({
        invoice_number: invoice.invoiceNumber,
        invoice_type: invoice.invoiceType,
        customer_id: invoice.customerId,
        date: invoice.date,
        due_date: invoice.dueDate,
        subtotal: invoice.subtotal,
        vat_amount: invoice.vatAmount,
        total: invoice.total,
        status: invoice.status,
        notes: invoice.notes,
        qr_code: invoice.qrCode,
        zatca_uuid: invoice.zatcaUuid,
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
      .from("sales_invoice_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return this.getById(invoiceData.id) as Promise<SalesInvoice>;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("sales_invoices")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};