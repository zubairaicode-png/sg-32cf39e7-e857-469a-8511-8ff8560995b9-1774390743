import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/types";

function mapRow(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    code: row.customer_code as string,
    nameEnglish: row.name_english as string,
    nameArabic: (row.name_arabic as string) || "",
    vatNumber: (row.vat_number as string) || undefined,
    commercialRegister: (row.commercial_registration as string) || undefined,
    email: (row.email as string) || undefined,
    phone: (row.phone as string) || undefined,
    buildingNumber: (row.building_number as string) || "",
    streetName: (row.street_name as string) || "",
    district: (row.district as string) || "",
    city: (row.city as string) || "",
    postalCode: (row.postal_code as string) || "",
    country: (row.country as string) || "Saudi Arabia",
    creditLimit: Number(row.credit_limit) || 0,
    paymentTerms: (row.payment_term as string) || "net30",
    balance: Number(row.current_balance) || 0,
    isActive: row.is_active !== false,
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
      throw new Error(error.message);
    }

    return (data || []).map((row) => mapRow(row as Record<string, unknown>));
  },

  async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching customer by ID:", error);
      throw new Error(error.message);
    }

    if (!data) return null;
    return mapRow(data as Record<string, unknown>);
  },

  async create(customer: Omit<Customer, "id" | "createdAt" | "balance">): Promise<Customer> {
    const insertData = {
      customer_code: customer.code,
      name_english: customer.nameEnglish,
      name_arabic: customer.nameArabic || null,
      vat_number: customer.vatNumber || null,
      commercial_registration: customer.commercialRegister || null,
      email: customer.email || null,
      phone: customer.phone || null,
      building_number: customer.buildingNumber || null,
      street_name: customer.streetName || null,
      district: customer.district || null,
      city: customer.city,
      postal_code: customer.postalCode || null,
      country: customer.country || "Saudi Arabia",
      credit_limit: customer.creditLimit ?? 0,
      payment_term: (customer.paymentTerms || "net30") as "cash" | "net15" | "net30" | "net60" | "net90",
      is_active: customer.isActive ?? true,
      opening_balance: 0,
      current_balance: 0,
    };

    const { data, error } = await supabase
      .from("customers")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating customer:", error);
      throw new Error(error.message || "Failed to create customer");
    }

    return mapRow(data as Record<string, unknown>);
  },

  async update(
    id: string,
    updates: Partial<Omit<Customer, "id" | "createdAt" | "balance">>
  ): Promise<Customer> {
    const updateData: Record<string, unknown> = {};

    if (updates.code !== undefined) updateData.customer_code = updates.code;
    if (updates.nameArabic !== undefined) updateData.name_arabic = updates.nameArabic;
    if (updates.nameEnglish !== undefined) updateData.name_english = updates.nameEnglish;
    if (updates.vatNumber !== undefined) updateData.vat_number = updates.vatNumber;
    if (updates.commercialRegister !== undefined) updateData.commercial_registration = updates.commercialRegister;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.buildingNumber !== undefined) updateData.building_number = updates.buildingNumber;
    if (updates.streetName !== undefined) updateData.street_name = updates.streetName;
    if (updates.district !== undefined) updateData.district = updates.district;
    if (updates.city !== undefined) updateData.city = updates.city;
    if (updates.postalCode !== undefined) updateData.postal_code = updates.postalCode;
    if (updates.country !== undefined) updateData.country = updates.country;
    if (updates.creditLimit !== undefined) updateData.credit_limit = updates.creditLimit;
    if (updates.paymentTerms !== undefined) updateData.payment_term = updates.paymentTerms;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating customer:", error);
      throw new Error(error.message);
    }

    return mapRow(data as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
      console.error("Error deleting customer:", error);
      throw new Error(error.message);
    }
  },
};