import { supabase } from "@/integrations/supabase/client";
import type { SalesInvoice, SalesInvoiceItem } from "@/types";

export const salesService = {
  async getAll(): Promise<SalesInvoice[]> {
    const { data, error } = await supabase
      .from("sales_invoices")
      .select(`
        *,
        customer:customers(id, customer_code, name_english, name_arabic),
        items:sales_invoice_items(*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      invoiceType: invoice.invoice_type as SalesInvoice["invoiceType"],
      customerId: invoice.customer_id,
      customerName: invoice.customer?.name_english || invoice.customer_name || "",
      invoiceDate: invoice.invoice_date,
      dueDate: invoice.due_date || "",
      subtotal: invoice.subtotal,
      vatAmount: invoice.vat_amount || 0,
      totalAmount: invoice.total_amount,
      status: invoice.status as SalesInvoice["status"],
      zatcaUUID: invoice.zatca_uuid || undefined,
      zatcaHash: invoice.zatca_hash || undefined,
      qrCode: invoice.qr_code || undefined,
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

  async getById(id: string): Promise<SalesInvoice | null> {
    const { data, error } = await supabase
      .from("sales_invoices")
      .select(`
        *,
        customer:customers(id, customer_code, name_english, name_arabic),
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
      customerName: data.customer?.name_english || data.customer_name || "",
      invoiceDate: data.invoice_date,
      dueDate: data.due_date || "",
      subtotal: data.subtotal,
      vatAmount: data.vat_amount || 0,
      totalAmount: data.total_amount,
      status: data.status as SalesInvoice["status"],
      zatcaUUID: data.zatca_uuid || undefined,
      zatcaHash: data.zatca_hash || undefined,
      qrCode: data.qr_code || undefined,
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

  async create(invoice: Omit<SalesInvoice, "id" | "createdAt">, items: Omit<SalesInvoiceItem, "id">[]): Promise<SalesInvoice> {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("sales_invoices")
      .insert({
        invoice_number: invoice.invoiceNumber,
        invoice_type: invoice.invoiceType,
        customer_id: invoice.customerId,
        customer_name: invoice.customerName,
        invoice_date: invoice.invoiceDate,
        due_date: invoice.dueDate,
        subtotal: invoice.subtotal,
        vat_amount: invoice.vatAmount,
        total_amount: invoice.totalAmount,
        status: invoice.status as any,
        zatca_uuid: invoice.zatcaUUID,
        zatca_hash: invoice.zatcaHash,
        notes: invoice.notes,
        qr_code: invoice.qrCode,
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